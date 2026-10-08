// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../src/components/onlycat-pet-status";
import "../src/components/onlycat-camera-panel";
import type { HomeAssistant, PetInfo } from "../src/components/types";

const MINOU: PetInfo = {
  entityId: "device_tracker.900123000000001_tracker",
  rfid: "900123000000001",
  name: "Minou",
  color: "pink",
};
const FILOU: PetInfo = { ...MINOU, entityId: "device_tracker.2_tracker", rfid: "2", name: "Filou" };
const NOW = Date.parse("2026-06-15T10:00:00Z");

function makeHass(
  states: Record<string, { state: string; attributes?: Record<string, unknown> }>,
): HomeAssistant {
  return {
    states: Object.fromEntries(
      Object.entries(states).map(([id, s]) => [
        id,
        {
          entity_id: id,
          attributes: {},
          last_changed: "2026-06-15T08:30:00Z",
          ...s,
        },
      ]),
    ),
    locale: { language: "en" },
  } as unknown as HomeAssistant;
}

describe("onlycat-pet-status", () => {
  let el: HTMLElementTagNameMap["onlycat-pet-status"];

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    el = document.createElement("onlycat-pet-status");
    el.pets = [MINOU, FILOU];
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
    vi.useRealTimers();
  });

  const chips = () => [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".pet")];

  it("shows where each cat is and for how long", async () => {
    el.hass = makeHass({
      [MINOU.entityId]: { state: "home" },
      [FILOU.entityId]: { state: "not_home" },
    });
    await el.updateComplete;
    const [minou, filou] = chips();
    expect(minou.classList.contains("pet--inside")).toBe(true);
    expect(minou.getAttribute("aria-label")).toBe("Minou · Inside · 1h30");
    expect(filou.classList.contains("pet--outside")).toBe(true);
    expect(filou.type).toBe("button");
  });

  it.each([
    ["unavailable", "Unavailable"],
    ["unknown", "Unknown"],
  ])("does not show a %s tracker as inside", async (state, label) => {
    el.hass = makeHass({ [MINOU.entityId]: { state } });
    await el.updateComplete;
    const [minou, filou] = chips();
    expect(minou.classList.contains("pet--unknown")).toBe(true);
    expect(minou.getAttribute("aria-label")).toBe(`Minou · ${label}`);
    expect(minou.querySelector("ha-icon")!.getAttribute("icon")).toBe(
      "mdi:help-circle-outline",
    );
    // Missing tracker.
    expect(filou.getAttribute("aria-label")).toBe("Filou · Unavailable");
  });

  it("opens the tracker's more-info dialog", async () => {
    el.hass = makeHass({ [MINOU.entityId]: { state: "home" } });
    await el.updateComplete;
    const seen: string[] = [];
    el.addEventListener("hass-more-info", (e) =>
      seen.push((e as CustomEvent).detail.entityId),
    );
    chips()[0].click();
    expect(seen).toEqual([MINOU.entityId]);
  });
});

describe("onlycat-camera-panel last passage", () => {
  const CAMERA = "camera.oc_1_last_activity_video";
  const EVENT = "binary_sensor.oc_1_event";
  let el: HTMLElementTagNameMap["onlycat-camera-panel"];

  afterEach(() => el.remove());

  async function mount(
    eventState: string,
    attributes: Record<string, unknown>,
    pets: PetInfo[] = [MINOU],
  ) {
    el = document.createElement("onlycat-camera-panel");
    el.hass = makeHass({
      [CAMERA]: {
        state: "idle",
        attributes: { entity_picture: `/api/camera_proxy/${CAMERA}?token=x` },
      },
      [EVENT]: { state: eventState, attributes },
    });
    el.entityId = CAMERA;
    el.eventEntityId = EVENT;
    el.pets = pets;
    document.body.appendChild(el);
    await el.updateComplete;
    return el.shadowRoot!.querySelector(".camera-passage");
  }

  const exit = { direction: "OUTWARD", action: "TRANSIT", rfidCode: MINOU.rfid };

  it("shows the direction and the cat of the last passage", async () => {
    const badge = await mount("off", exit);
    expect(badge!.textContent!.replace(/\s+/g, " ").trim()).toBe("Out · Minou");
  });

  it("says nothing about a visitor's passage", async () => {
    expect(await mount("off", { ...exit, rfidCode: "999" })).toBeNull();
  });

  it("ignores the stale summary of an unavailable sensor", async () => {
    expect(await mount("unavailable", exit)).toBeNull();
  });
});
