import { describe, expect, it } from "vitest";
import { historyPath, parseHistory } from "../src/utils/history";
import type { HistoryEntry } from "../src/components/types";

const EVENT = "binary_sensor.oc_x_event";
const HUMAN = "binary_sensor.oc_x_human";
const t = (iso: string) => Date.parse(iso);
const sec = (iso: string) => Date.parse(iso) / 1000;

describe("parseHistory", () => {
  it("parses minimal_response series (lc, then lu fallback)", () => {
    const raw: HistoryEntry[][] = [
      [
        {
          entity_id: EVENT,
          state: "off",
          last_changed: "2026-06-14T22:00:00+00:00",
        },
        { s: "on", lc: sec("2026-06-15T07:00:00Z") },
        { s: "off", lu: sec("2026-06-15T07:00:12Z") },
        { s: "on", lc: sec("2026-06-15T09:00:00Z") },
        { s: "off", lc: sec("2026-06-15T09:01:00Z") },
      ],
    ];
    const [event, human] = parseHistory(raw, [EVENT, HUMAN], t("2026-06-15T10:00:00Z"));
    expect(event).toEqual([
      { startTs: t("2026-06-15T07:00:00Z"), endTs: t("2026-06-15T07:00:12Z") },
      { startTs: t("2026-06-15T09:00:00Z"), endTs: t("2026-06-15T09:01:00Z") },
    ]);
    expect(human).toEqual([]);
  });

  it("closes a period still on at the window end", () => {
    const end = t("2026-06-15T10:00:00Z");
    const raw: HistoryEntry[][] = [
      [
        { entity_id: HUMAN, state: "on", last_changed: "2026-06-15T09:59:00Z" },
      ],
    ];
    expect(parseHistory(raw, [EVENT, HUMAN], end)[1]).toEqual([
      { startTs: t("2026-06-15T09:59:00Z"), endTs: end },
    ]);
  });

  it("accepts full-format entries after the first one", () => {
    const raw: HistoryEntry[][] = [
      [
        { entity_id: EVENT, state: "on", last_changed: "2026-06-15T01:00:00Z" },
        { entity_id: EVENT, state: "off", last_changed: "2026-06-15T01:00:05Z" },
      ],
    ];
    expect(parseHistory(raw, [EVENT], 0)[0]).toEqual([
      { startTs: t("2026-06-15T01:00:00Z"), endTs: t("2026-06-15T01:00:05Z") },
    ]);
  });

  it("ignores unknown entities, empty series, entries without timestamp", () => {
    const raw = [
      [],
      [{ entity_id: "binary_sensor.other", state: "on", last_changed: "2026-06-15T01:00:00Z" }],
      [
        { entity_id: EVENT, state: "off", last_changed: "2026-06-15T00:00:00Z" },
        { s: "on" },
        { s: "unavailable", lc: sec("2026-06-15T02:00:00Z") },
      ],
    ] as HistoryEntry[][];
    expect(parseHistory(raw, [EVENT, ""], 0)).toEqual([[], []]);
  });

  it("returns empty rows for a non-array response", () => {
    expect(parseHistory(null as unknown as HistoryEntry[][], [EVENT], 0)).toEqual([[]]);
  });
});

describe("historyPath", () => {
  it("builds the history/period query", () => {
    expect(
      historyPath([EVENT, HUMAN], t("2026-06-14T22:00:00Z"), t("2026-06-15T22:00:00Z")),
    ).toBe(
      "history/period/2026-06-14T22:00:00.000Z" +
        `?filter_entity_id=${EVENT},${HUMAN}` +
        "&end_time=2026-06-15T22:00:00.000Z" +
        "&minimal_response&no_attributes&significant_changes_only=false",
    );
  });
});
