// ─── Time-zone aware calendar helpers ─────────────────────────────────────────
//
// The history frise shows calendar days. Those days must match the ones Home
// Assistant shows in its own history panel: they are computed in the time zone
// selected in the user profile (server zone by default), not in the browser
// zone, and a day runs from midnight to the next midnight, which lasts 23 h or
// 25 h on daylight-saving transitions.

import type { HassLocale, HomeAssistant } from "../components/types";

export interface CalendarDay {
  year: number;
  /** 1–12 */
  month: number;
  day: number;
}

export interface TimeWindow {
  /** IANA time zone the window was computed in. */
  timeZone: string;
  /** Calendar day covered by the window. */
  day: CalendarDay;
  /** Epoch ms of the local midnight starting the day. */
  start: number;
  /** Epoch ms of the end of the window: `dayEnd`, or "now" for today. */
  end: number;
  /** Epoch ms of the next local midnight. */
  dayEnd: number;
}

export interface AxisTick {
  ts: number;
  /** Position within the window, 0–1. */
  frac: number;
  label: string;
}

const browserTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

/**
 * Time zone used to display dates, following the HA profile setting:
 * "local" → browser zone, otherwise ("server", default) → `hass.config.time_zone`.
 */
export function resolveTimeZone(hass: HomeAssistant | undefined): string {
  if (hass?.locale?.time_zone === "local") return browserTimeZone();
  return hass?.config?.time_zone || browserTimeZone();
}

/** Same rule as the HA frontend (`useAmPm`). */
export function useAmPm(locale: HassLocale | undefined): boolean {
  const format = locale?.time_format ?? "language";
  if (format === "12") return true;
  if (format === "24") return false;
  const lang = format === "system" ? undefined : locale?.language;
  const test = new Date("January 1, 2023 22:00:00").toLocaleString(lang);
  return test.includes("10");
}

const partsFormatters = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let fmt = partsFormatters.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    partsFormatters.set(timeZone, fmt);
  }
  return fmt;
}

/** Wall-clock components of `ts` in `timeZone`. */
export function zonedParts(
  ts: number,
  timeZone: string,
): CalendarDay & { hour: number; minute: number; second: number } {
  const out: Record<string, number> = {};
  for (const p of partsFormatter(timeZone).formatToParts(new Date(ts))) {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  }
  return {
    year: out.year,
    month: out.month,
    day: out.day,
    hour: out.hour % 24,
    minute: out.minute,
    second: out.second,
  };
}

/** Offset (ms) of `timeZone` from UTC at instant `ts`. */
function offsetAt(ts: number, timeZone: string): number {
  const p = zonedParts(ts, timeZone);
  const asUtc = Date.UTC(
    p.year,
    p.month - 1,
    p.day,
    p.hour,
    p.minute,
    p.second,
  );
  return asUtc - (ts - (((ts % 1000) + 1000) % 1000));
}

/**
 * Epoch ms of the wall-clock time `day hour:minute` in `timeZone`.
 * A time skipped by a DST jump resolves to the instant just after the jump.
 */
export function zonedTimeToEpoch(
  day: CalendarDay,
  hour: number,
  minute: number,
  timeZone: string,
): number {
  const guess = Date.UTC(day.year, day.month - 1, day.day, hour, minute);
  const offset = offsetAt(guess, timeZone);
  const ts = guess - offset;
  const offset2 = offsetAt(ts, timeZone);
  return offset2 === offset ? ts : guess - offset2;
}

export function addDays(day: CalendarDay, n: number): CalendarDay {
  const d = new Date(Date.UTC(day.year, day.month - 1, day.day + n));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/**
 * Calendar-day window `offsetDays` days before the day containing `now`:
 * local midnight → next local midnight, or → `now` for the current day.
 */
export function dayWindow(
  now: number,
  offsetDays: number,
  timeZone: string,
): TimeWindow {
  const today = zonedParts(now, timeZone);
  const day = addDays(today, -offsetDays);
  const start = zonedTimeToEpoch(day, 0, 0, timeZone);
  const dayEnd = zonedTimeToEpoch(addDays(day, 1), 0, 0, timeZone);
  const end =
    offsetDays === 0 ? Math.min(Math.max(now, start + 1), dayEnd) : dayEnd;
  return { timeZone, day, start, end, dayEnd };
}

/** Position of `ts` within the window, clamped to 0–1. */
export function windowFraction(win: TimeWindow, ts: number): number {
  const span = win.end - win.start;
  if (span <= 0) return 0;
  return Math.min(1, Math.max(0, (ts - win.start) / span));
}

/** Hour label: "6h" (24 h clock) or "6 AM" (12 h clock). */
export function formatHour(hour: number, amPm: boolean): string {
  if (!amPm) return `${hour}h`;
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12} ${hour % 24 < 12 ? "AM" : "PM"}`;
}

/** Wall-clock time of `ts` in `timeZone`, honouring the 12/24 h preference. */
export function formatTime(
  ts: number,
  timeZone: string,
  lang: string,
  amPm: boolean,
  withSeconds = false,
): string {
  return new Intl.DateTimeFormat(lang, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    ...(withSeconds ? { second: "2-digit" } : {}),
    hourCycle: amPm ? "h12" : "h23",
  }).format(new Date(ts));
}

/** Short axis label for `ts`: "14h", "14h30" (24 h) or "2 PM", "2:30 PM". */
export function formatAxisTime(
  ts: number,
  timeZone: string,
  amPm: boolean,
): string {
  const { hour, minute } = zonedParts(ts, timeZone);
  if (minute === 0) return formatHour(hour, amPm);
  const mm = String(minute).padStart(2, "0");
  if (!amPm) return `${hour}h${mm}`;
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${mm} ${hour < 12 ? "AM" : "PM"}`;
}

/**
 * Axis ticks every 6 wall-clock hours (0h, 6h, 12h, 18h, 24h) that fall within
 * the window, plus a final tick at the window end for the current day.
 */
export function axisTicks(win: TimeWindow, amPm: boolean): AxisTick[] {
  const ticks: AxisTick[] = [];
  for (let h = 0; h <= 24; h += 6) {
    const ts =
      h === 24 ? win.dayEnd : zonedTimeToEpoch(win.day, h, 0, win.timeZone);
    if (ts > win.end + 1) break;
    ticks.push({
      ts,
      frac: windowFraction(win, ts),
      label: formatHour(h, amPm),
    });
  }
  if (win.end < win.dayEnd) {
    const lastFrac = ticks[ticks.length - 1]?.frac ?? 0;
    if (lastFrac < 0.97) {
      ticks.push({
        ts: win.end,
        frac: 1,
        label: formatAxisTime(win.end, win.timeZone, amPm),
      });
    }
  }
  return ticks;
}
