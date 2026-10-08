import { describe, expect, it } from "vitest";
import {
  historyMessage,
  isOn,
  knownCatPassages,
  parsePassages,
  parsePeriods,
  parseTimeline,
  stateTs,
  timelineRows,
  type TimelineRowStyle,
} from "../src/utils/history";
import { isOutside } from "../src/components/onlycat-pets";
import type {
  CompressedState,
  Passage,
  PetInfo,
} from "../src/components/types";

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

const MINOU = "900123000000001";
const FILOU = "900123000000002";
const VISITOR = "999000000000999";
const PETS: PetInfo[] = [
  { entityId: `device_tracker.${MINOU}_tracker`, rfid: MINOU, name: "Minou", color: "pink" },
  { entityId: `device_tracker.${FILOU}_tracker`, rfid: FILOU, name: "Filou", color: "cyan" },
];

describe("parsePassages", () => {
  it("reads the direction, the action and the chips of each event", () => {
    const series: CompressedState[] = [
      { s: "off", lu: sec("2026-06-14T21:00:00Z") },
      {
        s: "on",
        lu: sec("2026-06-15T07:00:00Z"),
        a: { eventId: 1, direction: "OUTWARD", action: "TRANSIT", rfidCode: MINOU },
      },
      { s: "off", lu: sec("2026-06-15T07:00:20Z"), a: { eventId: 1 } },
      {
        s: "on",
        lu: sec("2026-06-15T08:00:00Z"),
        a: { eventId: 2, direction: "INWARD", action: "NONE", rfidCodes: [FILOU.toUpperCase()] },
      },
      { s: "off", lu: sec("2026-06-15T08:00:05Z"), a: { eventId: 2 } },
    ];
    expect(parsePassages(series, START, END)).toEqual([
      {
        startTs: t("2026-06-15T07:00:00Z"),
        endTs: t("2026-06-15T07:00:20Z"),
        eventId: 1,
        kind: "out",
        rfids: [MINOU],
      },
      {
        startTs: t("2026-06-15T08:00:00Z"),
        endTs: t("2026-06-15T08:00:05Z"),
        eventId: 2,
        kind: "in_attempt",
        rfids: [FILOU],
      },
    ]);
  });

  it("merges a summary that arrives after the sensor turned off", () => {
    const series: CompressedState[] = [
      { s: "on", lu: sec("2026-06-15T07:00:00Z"), a: { eventId: 7 } },
      { s: "off", lu: sec("2026-06-15T07:00:10Z"), a: { eventId: 7 } },
      // Attribute-only update for the same event, then one wiping it again.
      { s: "off", lu: sec("2026-06-15T07:00:12Z"), a: { eventId: 7, direction: "INWARD", rfidCode: MINOU } },
      { s: "off", lu: sec("2026-06-15T07:00:15Z"), a: { eventId: 7 } },
    ];
    const [p] = parsePassages(series, START, END);
    expect(p.kind).toBe("in");
    expect(p.rfids).toEqual([MINOU]);
    expect(p.endTs).toBe(t("2026-06-15T07:00:10Z"));
  });

  it("splits back-to-back events that switch eventId while on", () => {
    const series: CompressedState[] = [
      { s: "on", lu: sec("2026-06-15T07:00:00Z"), a: { eventId: 1, direction: "OUTWARD" } },
      { s: "on", lu: sec("2026-06-15T07:00:30Z"), a: { eventId: 2, direction: "INWARD" } },
      { s: "off", lu: sec("2026-06-15T07:01:00Z") },
    ];
    const passages = parsePassages(series, START, END);
    expect(passages.map((p) => [p.eventId, p.kind, p.endTs])).toEqual([
      [1, "out", t("2026-06-15T07:00:30Z")],
      [2, "in", t("2026-06-15T07:01:00Z")],
    ]);
  });

  it("leaves passages without a summary undirected (integration < 2.0.7)", () => {
    const series: CompressedState[] = [
      { s: "on", lu: sec("2026-06-15T07:00:00Z") },
      { s: "off", lu: sec("2026-06-15T07:00:10Z") },
    ];
    expect(parsePassages(series, START, END)[0]).toMatchObject({
      kind: "unknown",
      rfids: [],
    });
  });
});

const passage = (rfids: string[], h: number): Passage => ({
  startTs: t(`2026-06-15T0${h}:00:00Z`),
  endTs: t(`2026-06-15T0${h}:00:10Z`),
  kind: "out",
  rfids,
});

describe("knownCatPassages", () => {
  const all = [passage([MINOU], 1), passage([VISITOR], 2), passage([], 3), passage([VISITOR, FILOU], 4)];

  it("hides visitors' passages and passages without a chip", () => {
    expect(knownCatPassages(all, PETS)).toEqual([all[0], all[3]]);
  });

  it("keeps every passage when no cat is known", () => {
    expect(knownCatPassages(all, [])).toEqual(all);
  });
});

describe("timelineRows", () => {
  const STYLE: TimelineRowStyle = {
    flap: { label: "Passage", color: "blue" },
    prey: { label: "Prey", color: "red" },
    human: { label: "Human", color: "purple" },
  };

  it("adds one row per cat between the flap and the prey rows", () => {
    const passages = [passage([MINOU], 1), passage([VISITOR], 2), passage([MINOU, FILOU], 3)];
    const outside = { [MINOU]: [{ startTs: 1, endTs: 2 }] };
    const rows = timelineRows(
      { passages, prey: [], human: [], lock: [], outside },
      PETS,
      STYLE,
    );
    expect(rows.map((r) => [r.key, r.label, r.color, r.events.length, r.passages])).toEqual([
      ["flap", "Passage", "blue", 2, true],
      [`pet:${MINOU}`, "Minou", "pink", 2, true],
      [`pet:${FILOU}`, "Filou", "cyan", 1, true],
      ["prey", "Prey", "red", 0, false],
      ["human", "Human", "purple", 0, false],
    ]);
    expect(rows[1].background).toEqual(outside[MINOU]);
    expect(rows[2].background).toEqual([]);
  });

  it("reads each cat's outside periods from its tracker", () => {
    const tracker = PETS[0].entityId;
    const data = parseTimeline(
      {
        [tracker]: [
          { s: "home", lu: sec("2026-06-14T20:00:00Z") },
          { s: "not_home", lu: sec("2026-06-15T07:00:20Z") },
          { s: "home", lu: sec("2026-06-15T09:00:00Z") },
          { s: "unavailable", lu: sec("2026-06-15T09:30:00Z") },
        ],
      },
      {},
      PETS,
      isOutside,
      START,
      END,
    );
    expect(data.outside).toEqual({
      [MINOU]: [{ startTs: t("2026-06-15T07:00:20Z"), endTs: t("2026-06-15T09:00:00Z") }],
      [FILOU]: [],
    });
  });
});
