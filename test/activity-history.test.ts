// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../src/components/onlycat-activity-history";
import type { HomeAssistant } from "../src/components/types";

const EVENT = "binary_sensor.oc_x_event";

interface Pending {
  path: string;
  resolve: (v: unknown) => void;
}

function makeHass(pending: Pending[]): HomeAssistant {
  return {
    states: {},
    config: { time_zone: "Europe/Paris" },
    locale: { language: "en", time_format: "24", time_zone: "server" },
    callApi: (_method: string, path: string) =>
      new Promise((resolve) => pending.push({ path, resolve })),
    callService: async () => undefined,
  } as unknown as HomeAssistant;
}

const dayOf = (path: string) => path.split("/")[2].split("?")[0];
const flush = () => new Promise((r) => setTimeout(r, 0));

describe("onlycat-activity-history navigation", () => {
  let el: HTMLElementTagNameMap["onlycat-activity-history"];
  let pending: Pending[];

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-06-15T10:00:00Z"));
    pending = [];
    el = document.createElement("onlycat-activity-history");
    el.hass = makeHass(pending);
    el.eventEntityId = EVENT;
    el.contrabandEntityId = "";
    el.humanEntityId = "";
    el.historyDays = 2;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
    vi.useRealTimers();
  });

  const root = () => el.shadowRoot!;
  const navButtons = () =>
    [...root().querySelectorAll<HTMLButtonElement>(".chart-nav .nav-btn")];

  it("ignores a stale response and keeps header and data in sync", async () => {
    (root().querySelector(".history-toggle") as HTMLButtonElement).click();
    expect(pending).toHaveLength(1);
    pending[0].resolve([]);
    await flush();
    await el.updateComplete;

    // ◄ once: request for 14 June starts, buttons are disabled meanwhile.
    navButtons()[0].click();
    await el.updateComplete;
    expect(pending).toHaveLength(2);
    expect(navButtons().every((b) => b.disabled)).toBe(true);
    // A second click while loading is ignored (no J-2 header with J-1 data).
    navButtons()[0].click();
    expect(pending).toHaveLength(2);

    pending[1].resolve([]);
    await flush();
    await el.updateComplete;
    expect(root().querySelector(".nav-label")!.textContent).toContain("14");

    // Reopen the frise while a request is in flight: the older response,
    // resolving last, must not overwrite the newer one.
    navButtons()[1].click(); // ► back to 15 June, request #3
    await el.updateComplete;
    (root().querySelector(".history-toggle") as HTMLButtonElement).click();
    (root().querySelector(".history-toggle") as HTMLButtonElement).click();
    expect(pending).toHaveLength(4); // request #4 for the same day

    const newer = Date.parse("2026-06-15T09:00:00Z") / 1000;
    pending[3].resolve([
      [
        { entity_id: EVENT, state: "off", last_changed: "2026-06-14T22:00:00Z" },
        { s: "on", lc: newer },
        { s: "off", lc: newer + 10 },
      ],
    ]);
    await flush();
    pending[2].resolve([]); // stale, must be dropped
    await flush();
    await el.updateComplete;
    expect(root().querySelector(".chart-count")!.textContent).toBe("1");
  });

  it("queries calendar days of the HA time zone and stops at historyDays", async () => {
    (root().querySelector(".history-toggle") as HTMLButtonElement).click();
    expect(dayOf(pending[0].path)).toBe("2026-06-14T22:00:00.000Z");
    for (let i = 0; i < 2; i++) {
      pending[pending.length - 1].resolve([]);
      await flush();
      await el.updateComplete;
      navButtons()[0].click();
      await el.updateComplete;
    }
    expect(dayOf(pending[2].path)).toBe("2026-06-12T22:00:00.000Z");
    pending[2].resolve([]);
    await flush();
    await el.updateComplete;
    expect(navButtons()[0].disabled).toBe(true);
    navButtons()[0].click();
    expect(pending).toHaveLength(3);
  });
});
