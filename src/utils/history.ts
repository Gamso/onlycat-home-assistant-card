// ─── History API parsing ──────────────────────────────────────────────────────

import type {
  HistoryEntry,
  HistoryStateFull,
  HistoryStateMinimal,
  ParsedPeriod,
} from "../components/types";

/** State and timestamp (ms) of one history entry, or null if unusable. */
function readEntry(entry: HistoryEntry): { state: string; ts: number } | null {
  if ("state" in entry) {
    // Full-format entry: the first entry of a series always has entity_id +
    // state, and HA may also send later entries with state/last_changed.
    const e = entry as HistoryStateFull;
    const ts = new Date(e.last_changed).getTime();
    return isNaN(ts) ? null : { state: e.state, ts };
  }
  // minimal_response: `lc` is seconds since epoch; HA omits it when
  // last_changed == last_updated, `lu` then carries the same timestamp.
  const e = entry as HistoryStateMinimal;
  const sec = e.lc ?? e.lu;
  if (sec === undefined) return null;
  return { state: e.s, ts: sec > 1e12 ? sec : sec * 1000 };
}

/**
 * Turns a `history/period` response into "on" periods per entity.
 * Result `i` holds the periods of `entityIds[i]`; a period still "on" at the
 * end of the response is closed at `windowEnd`.
 */
export function parseHistory(
  raw: HistoryEntry[][],
  entityIds: readonly string[],
  windowEnd: number,
): ParsedPeriod[][] {
  const result: ParsedPeriod[][] = entityIds.map(() => []);
  if (!Array.isArray(raw)) return result;

  for (const series of raw) {
    if (!series?.length) continue;
    const first = series[0] as HistoryStateFull;
    const idx = first.entity_id ? entityIds.indexOf(first.entity_id) : -1;
    if (idx === -1) continue;

    let onSince: number | null = null;
    for (const entry of series) {
      const read = readEntry(entry);
      if (!read) continue;
      if (read.state === "on" && onSince === null) {
        onSince = read.ts;
      } else if (read.state !== "on" && onSince !== null) {
        result[idx].push({ startTs: onSince, endTs: read.ts });
        onSince = null;
      }
    }
    if (onSince !== null) {
      result[idx].push({
        startTs: onSince,
        endTs: Math.max(onSince, windowEnd),
      });
    }
  }
  return result;
}

/** `history/period` API path for the given entities and window. */
export function historyPath(
  entityIds: readonly string[],
  start: number,
  end: number,
): string {
  return (
    `history/period/${new Date(start).toISOString()}` +
    `?filter_entity_id=${entityIds.join(",")}` +
    `&end_time=${new Date(end).toISOString()}` +
    `&minimal_response&no_attributes&significant_changes_only=false`
  );
}
