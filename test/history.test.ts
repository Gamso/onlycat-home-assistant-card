import { describe, expect, it } from "vitest";
import {
  historyMessage,
  isOn,
  parsePeriods,
  parseTimeline,
  stateTs,
} from "../src/utils/history";
import type { CompressedState } from "../src/components/types";

const EVENT = "binary_sensor.oc_x_event";
const HUMAN = "binary_sensor.oc_x_human";
const t = (iso: string) => Date.parse(iso);
const sec = (iso: string) => Date.parse(iso) / 1000;
const START = t("2026-06-14T22:00:00Z");
const END = t("2026-06-15T10:00:00Z");

describe("stateTs", () => {
  it("prefers lc and falls back to lu", () => {
    expect(stateTs({ s: "on", lc: 10, lu: 20 })).toBe(10_000);
    expect(stateTs({ s: "on", lu: 20.5 })).toBe(20_500);
  });
});

describe("parsePeriods", () => {
  it("turns a compressed series into on periods", () => {
    const series: CompressedState[] = [
      { s: "off", lu: sec("2026-06-14T20:00:00Z") },
      { s: "on", lu: sec("2026-06-15T07:00:00Z") },
      { s: "off", lu: sec("2026-06-15T07:00:12Z") },
      { s: "on", lc: sec("2026-06-15T09:00:00Z"), lu: sec("2026-06-15T09:00:05Z") },
      { s: "off", lu: sec("2026-06-15T09:01:00Z") },
    ];
    expect(parsePeriods(series, isOn, START, END)).toEqual([
      { startTs: t("2026-06-15T07:00:00Z"), endTs: t("2026-06-15T07:00:12Z") },
      { startTs: t("2026-06-15T09:00:00Z"), endTs: t("2026-06-15T09:01:00Z") },
    ]);
  });

  it("clamps the start-time state and closes a period still on at the end", () => {
    // include_start_time_state: the first state predates the window.
    const series: CompressedState[] = [{ s: "on", lu: sec("2026-06-14T21:00:00Z") }];
    expect(parsePeriods(series, isOn, START, END)).toEqual([
      { startTs: START, endTs: END },
    ]);
  });

  it("ignores entries without a usable timestamp and missing series", () => {
    const series = [
      { s: "on" },
      { s: "unavailable", lu: sec("2026-06-15T02:00:00Z") },
    ] as CompressedState[];
    expect(parsePeriods(series, isOn, START, END)).toEqual([]);
    expect(parsePeriods(undefined, isOn, START, END)).toEqual([]);
  });
});

describe("parseTimeline", () => {
  it("maps each series to its row and skips unresolved entities", () => {
    const raw = {
      [HUMAN]: [
        { s: "on", lu: sec("2026-06-15T08:00:00Z") },
        { s: "off", lu: sec("2026-06-15T08:00:30Z") },
      ],
    };
    const data = parseTimeline(raw, { event: EVENT, human: HUMAN }, [], isOn, START, END);
    expect(data.passages).toEqual([]);
    expect(data.prey).toEqual([]);
    expect(data.human).toEqual([
      { startTs: t("2026-06-15T08:00:00Z"), endTs: t("2026-06-15T08:00:30Z") },
    ]);
    expect(parseTimeline(null, { event: EVENT }, [], isOn, START, END).passages).toEqual([]);
  });
});

describe("historyMessage", () => {
  it("builds the history_during_period websocket message", () => {
    expect(historyMessage([EVENT, HUMAN], START, t("2026-06-15T22:00:00Z"))).toEqual({
      type: "history/history_during_period",
      start_time: "2026-06-14T22:00:00.000Z",
      end_time: "2026-06-15T22:00:00.000Z",
      entity_ids: [EVENT, HUMAN],
      include_start_time_state: true,
      significant_changes_only: false,
      minimal_response: false,
      no_attributes: false,
    });
  });
});
