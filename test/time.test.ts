import { describe, expect, it } from "vitest";
import {
  axisTicks,
  dayWindow,
  formatAxisTime,
  resolveTimeZone,
  useAmPm,
  windowFraction,
  zonedTimeToEpoch,
} from "../src/utils/time";
import type { HomeAssistant } from "../src/components/types";

const PARIS = "Europe/Paris";
const HOUR = 3_600_000;
const iso = (ts: number) => new Date(ts).toISOString();

describe("dayWindow", () => {
  it("covers a regular day midnight → midnight in the HA time zone", () => {
    const now = Date.parse("2026-06-15T10:00:00Z");
    const win = dayWindow(now, 1, PARIS);
    expect(win.day).toEqual({ year: 2026, month: 6, day: 14 });
    expect(iso(win.start)).toBe("2026-06-13T22:00:00.000Z");
    expect(iso(win.end)).toBe("2026-06-14T22:00:00.000Z");
    expect(win.end - win.start).toBe(24 * HOUR);
  });

  it("ends at now for the current day", () => {
    const now = Date.parse("2026-06-15T10:00:00Z");
    const win = dayWindow(now, 0, PARIS);
    expect(iso(win.start)).toBe("2026-06-14T22:00:00.000Z");
    expect(win.end).toBe(now);
    expect(iso(win.dayEnd)).toBe("2026-06-15T22:00:00.000Z");
  });

  it("lasts 23 h on the spring-forward day (29 March 2026)", () => {
    const now = Date.parse("2026-03-30T12:00:00Z");
    const win = dayWindow(now, 1, PARIS);
    expect(win.day).toEqual({ year: 2026, month: 3, day: 29 });
    expect(iso(win.start)).toBe("2026-03-28T23:00:00.000Z"); // 00:00 CET
    expect(iso(win.end)).toBe("2026-03-29T22:00:00.000Z"); // 00:00 CEST
    expect(win.end - win.start).toBe(23 * HOUR);
  });

  it("lasts 25 h on the fall-back day (25 October 2026)", () => {
    const now = Date.parse("2026-10-26T12:00:00Z");
    const win = dayWindow(now, 1, PARIS);
    expect(win.day).toEqual({ year: 2026, month: 10, day: 25 });
    expect(iso(win.start)).toBe("2026-10-24T22:00:00.000Z"); // 00:00 CEST
    expect(iso(win.end)).toBe("2026-10-25T23:00:00.000Z"); // 00:00 CET
    expect(win.end - win.start).toBe(25 * HOUR);
  });

  it("does not depend on the browser time zone", () => {
    // 03:30 UTC on 15 June is still 14 June in Los Angeles.
    const now = Date.parse("2026-06-15T03:30:00Z");
    expect(dayWindow(now, 0, "America/Los_Angeles").day).toEqual({
      year: 2026,
      month: 6,
      day: 14,
    });
    expect(dayWindow(now, 0, PARIS).day).toEqual({
      year: 2026,
      month: 6,
      day: 15,
    });
  });

  it("steps over month and year boundaries", () => {
    const now = Date.parse("2026-01-01T12:00:00Z");
    const win = dayWindow(now, 1, PARIS);
    expect(win.day).toEqual({ year: 2025, month: 12, day: 31 });
  });
});

describe("zonedTimeToEpoch", () => {
  it("maps a time skipped by DST to the instant after the jump", () => {
    const ts = zonedTimeToEpoch({ year: 2026, month: 3, day: 29 }, 2, 30, PARIS);
    expect(iso(ts)).toBe("2026-03-29T01:30:00.000Z"); // 03:30 CEST
  });
});

describe("axisTicks", () => {
  it("places 6-hour ticks on wall-clock hours across spring-forward", () => {
    const win = dayWindow(Date.parse("2026-03-30T12:00:00Z"), 1, PARIS);
    const ticks = axisTicks(win, false);
    expect(ticks.map((t) => t.label)).toEqual(["0h", "6h", "12h", "18h", "24h"]);
    expect(ticks.map((t) => t.frac)).toEqual([0, 5 / 23, 11 / 23, 17 / 23, 1]);
  });

  it("places 6-hour ticks on wall-clock hours across fall-back", () => {
    const win = dayWindow(Date.parse("2026-10-26T12:00:00Z"), 1, PARIS);
    const ticks = axisTicks(win, false);
    expect(ticks.map((t) => t.label)).toEqual(["0h", "6h", "12h", "18h", "24h"]);
    expect(ticks.map((t) => t.frac)).toEqual([0, 7 / 25, 13 / 25, 19 / 25, 1]);
  });

  it("ends with the fetch time on the current day", () => {
    const now = Date.parse("2026-06-15T12:30:00Z"); // 14:30 in Paris
    const ticks = axisTicks(dayWindow(now, 0, PARIS), false);
    expect(ticks.map((t) => t.label)).toEqual(["0h", "6h", "12h", "14h30"]);
    expect(ticks[ticks.length - 1].frac).toBe(1);
  });

  it("uses a 12-hour clock when requested", () => {
    const win = dayWindow(Date.parse("2026-06-15T10:00:00Z"), 1, PARIS);
    expect(axisTicks(win, true).map((t) => t.label)).toEqual([
      "12 AM",
      "6 AM",
      "12 PM",
      "6 PM",
      "12 AM",
    ]);
  });
});

describe("windowFraction", () => {
  it("keeps bars aligned with the memorised window, not with now", () => {
    const fetchedAt = Date.parse("2026-06-15T08:00:00Z"); // 10:00 Paris
    const win = dayWindow(fetchedAt, 0, PARIS);
    const passage = Date.parse("2026-06-15T07:00:00Z"); // 09:00 Paris
    // Same answer however late the card re-renders: the window is fixed.
    expect(windowFraction(win, passage)).toBeCloseTo(9 / 10);
    expect(windowFraction(win, win.start - HOUR)).toBe(0);
    expect(windowFraction(win, win.end + HOUR)).toBe(1);
  });
});

describe("formatAxisTime", () => {
  it("formats in the given zone", () => {
    const ts = Date.parse("2026-06-15T12:05:00Z");
    expect(formatAxisTime(ts, PARIS, false)).toBe("14h05");
    expect(formatAxisTime(ts, PARIS, true)).toBe("2:05 PM");
  });
});

describe("resolveTimeZone / useAmPm", () => {
  const hass = (locale: object) =>
    ({ config: { time_zone: "Asia/Tokyo" }, locale }) as unknown as HomeAssistant;

  it("uses the server zone unless the profile asks for the local one", () => {
    expect(resolveTimeZone(hass({ time_zone: "server" }))).toBe("Asia/Tokyo");
    expect(resolveTimeZone(hass({}))).toBe("Asia/Tokyo");
    expect(resolveTimeZone(hass({ time_zone: "local" }))).toBe(
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
  });

  it("follows the profile time format", () => {
    expect(useAmPm({ time_format: "12" })).toBe(true);
    expect(useAmPm({ time_format: "24" })).toBe(false);
    expect(useAmPm({ time_format: "language", language: "fr" })).toBe(false);
    expect(useAmPm({ time_format: "language", language: "en-US" })).toBe(true);
  });
});
