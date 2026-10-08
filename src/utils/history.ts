// ─── History API parsing ──────────────────────────────────────────────────────

import { classifyPassage } from "../components/onlycat-pets";
import type {
  CompressedState,
  ParsedPeriod,
  Passage,
  PetInfo,
} from "../components/types";

/** `history/history_during_period` response: entity id → state series. */
export type HistoryResponse = Record<string, CompressedState[] | undefined>;

/**
 * Websocket `history/history_during_period` message for the given entities
 * and window. It keeps attributes (eventId, direction, rfidCode…), which the
 * REST `history/period` query drops with `no_attributes`.
 */
export function historyMessage(
  entityIds: readonly string[],
  start: number,
  end: number,
): Record<string, unknown> {
  return {
    type: "history/history_during_period",
    start_time: new Date(start).toISOString(),
    end_time: new Date(end).toISOString(),
    entity_ids: [...entityIds],
    include_start_time_state: true,
    significant_changes_only: false,
    minimal_response: false,
    no_attributes: false,
  };
}

/**
 * Time (ms) of the last state change of a compressed entry: `lc` is omitted
 * when it equals `lu` (both seconds since epoch).
 */
export function stateTs(entry: CompressedState): number {
  return (entry.lc ?? entry.lu) * 1000;
}

export const isOn = (state: string): boolean => state === "on";

/**
 * Periods of `series` during which `isActive(state)` holds, clamped to the
 * window: the start-time state may predate `windowStart`, and a period still
 * active at the end of the series is closed at `windowEnd`.
 */
export function parsePeriods(
  series: readonly CompressedState[] | undefined,
  isActive: (state: string) => boolean,
  windowStart: number,
  windowEnd: number,
): ParsedPeriod[] {
  const result: ParsedPeriod[] = [];
  if (!Array.isArray(series)) return result;
  let since: number | null = null;
  for (const entry of series) {
    const ts = Math.max(windowStart, stateTs(entry));
    if (isNaN(ts)) continue;
    const active = isActive(entry.s);
    if (active && since === null) {
      since = ts;
    } else if (!active && since !== null) {
      result.push({ startTs: since, endTs: ts });
      since = null;
    }
  }
  if (since !== null) {
    result.push({ startTs: since, endTs: Math.max(since, windowEnd) });
  }
  return result;
}

/**
 * Flap events with their direction and pets.
 *
 * The event sensor turns on when an event starts; the summary (direction,
 * action, rfidCode) arrives as attribute-only updates, sometimes after the
 * sensor is already off, and a later event update can wipe it again. So
 * attributes are merged per `eventId` across every row, keeping the last
 * non-empty value, rather than read off a single state.
 */
export function parsePassages(
  series: readonly CompressedState[] | undefined,
  windowStart: number,
  windowEnd: number,
): Passage[] {
  const out: Passage[] = [];
  if (!Array.isArray(series)) return out;
  const byId = new Map<number, Passage>();
  const summary = new Map<Passage, { direction?: string; action?: string }>();
  let open: Passage | null = null;

  for (const entry of series) {
    const ts = Math.max(windowStart, stateTs(entry));
    if (isNaN(ts)) continue;
    const a = entry.a ?? {};
    const eventId = typeof a.eventId === "number" ? a.eventId : undefined;
    const on = entry.s === "on";

    const isNewEvent =
      on &&
      (!open ||
        (eventId !== undefined &&
          open.eventId !== undefined &&
          eventId !== open.eventId));
    if (isNewEvent) {
      if (open) open.endTs = ts;
      open = {
        startTs: ts,
        endTs: windowEnd,
        eventId,
        kind: "unknown",
        rfids: [],
      };
      out.push(open);
      summary.set(open, {});
    }

    let target = eventId !== undefined ? byId.get(eventId) : undefined;
    if (!target && on && open) target = open;
    if (target) {
      if (target.eventId === undefined && eventId !== undefined) {
        target.eventId = eventId;
      }
      if (target.eventId !== undefined) byId.set(target.eventId, target);
      const sum = summary.get(target)!;
      if (typeof a.direction === "string" && a.direction) {
        sum.direction = a.direction;
      }
      if (typeof a.action === "string" && a.action) sum.action = a.action;
      const codes: unknown[] = [
        ...(a.rfidCode ? [a.rfidCode] : []),
        ...(Array.isArray(a.rfidCodes) ? a.rfidCodes : []),
      ];
      for (const code of codes) {
        const c = String(code).toLowerCase();
        if (!target.rfids.includes(c)) target.rfids.push(c);
      }
    }

    if (!on && open) {
      open.endTs = ts;
      open = null;
    }
  }

  for (const p of out) {
    p.kind = classifyPassage(summary.get(p)!.direction, summary.get(p)!.action);
    p.endTs = Math.max(p.startTs, p.endTs);
  }
  return out;
}

/**
 * Passages of the known cats only: unknown visitors and passages where no
 * chip was read are hidden. Without any known cat (e.g. an integration older
 * than v2.0.7), every passage is kept, since none could be attributed.
 */
export function knownCatPassages(
  passages: readonly Passage[],
  pets: readonly PetInfo[],
): Passage[] {
  if (!pets.length) return [...passages];
  const known = new Set(pets.map((p) => p.rfid));
  return passages.filter((p) => p.rfids.some((r) => known.has(r)));
}

/** Everything the timeline draws, parsed from one history response. */
export interface TimelineData {
  passages: Passage[];
  prey: ParsedPeriod[];
  human: ParsedPeriod[];
  /** Lock sensor "on" periods, to flag passages triggered by an unlock. */
  lock: ParsedPeriod[];
  /** rfid → periods the pet spent outside */
  outside: Record<string, ParsedPeriod[]>;
}

export const EMPTY_TIMELINE: TimelineData = {
  passages: [],
  prey: [],
  human: [],
  lock: [],
  outside: {},
};

/** Parses a history response into the timeline data. */
export function parseTimeline(
  raw: HistoryResponse | null | undefined,
  ids: { event?: string; contraband?: string; human?: string; lock?: string },
  pets: readonly PetInfo[],
  isOutside: (state: string) => boolean,
  windowStart: number,
  windowEnd: number,
): TimelineData {
  const series = (id?: string) => (id ? raw?.[id] : undefined);
  const outside: Record<string, ParsedPeriod[]> = {};
  for (const pet of pets) {
    outside[pet.rfid] = parsePeriods(
      series(pet.entityId),
      isOutside,
      windowStart,
      windowEnd,
    );
  }
  return {
    passages: parsePassages(series(ids.event), windowStart, windowEnd),
    prey: parsePeriods(series(ids.contraband), isOn, windowStart, windowEnd),
    human: parsePeriods(series(ids.human), isOn, windowStart, windowEnd),
    lock: parsePeriods(series(ids.lock), isOn, windowStart, windowEnd),
    outside,
  };
}

/** One line of the timeline. */
export interface TimelineRow {
  key: string;
  label: string;
  /** CSS colour of the row label and of its non-passage bars. */
  color: string;
  /** Hoverable bars (zoom-navigable). */
  events: (ParsedPeriod | Passage)[];
  /** Pet rows only: periods the pet spent outside, drawn under the bars. */
  background?: ParsedPeriod[];
  /** Bars are flap passages, coloured by direction. */
  passages: boolean;
}

export type TimelineRowStyle = Record<
  "flap" | "prey" | "human",
  { label: string; color: string }
>;

/**
 * Timeline rows, top to bottom: the passages of the known cats, one row per
 * cat (its passages over the periods it spent outside), prey, human.
 */
export function timelineRows(
  data: TimelineData,
  pets: readonly PetInfo[],
  style: TimelineRowStyle,
): TimelineRow[] {
  const petRows: TimelineRow[] = pets.map((pet) => ({
    key: `pet:${pet.rfid}`,
    label: pet.name,
    color: pet.color,
    events: data.passages.filter((p) => p.rfids.includes(pet.rfid)),
    background: data.outside[pet.rfid] ?? [],
    passages: true,
  }));
  return [
    {
      key: "flap",
      ...style.flap,
      events: knownCatPassages(data.passages, pets),
      passages: true,
    },
    ...petRows,
    { key: "prey", ...style.prey, events: data.prey, passages: false },
    { key: "human", ...style.human, events: data.human, passages: false },
  ];
}

export function isPassage(ev: ParsedPeriod | Passage): ev is Passage {
  return "kind" in ev;
}
