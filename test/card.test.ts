// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/components/onlycat-home-assistant-card";
import type { HomeAssistant } from "../src/components/types";

type Card = HTMLElementTagNameMap["onlycat-home-assistant-card"];

function makeHass(states: Record<string, string>): HomeAssistant {
  return {
    states: Object.fromEntries(
      Object.entries(states).map(([id, state]) => [
        id,
        { entity_id: id, state, attributes: {} },
      ]),
    ),
    entities: {},
    config: { time_zone: "Europe/Paris" },
    locale: { language: "en" },
    callApi: async () => [],
    callService: vi.fn(async () => undefined),
  } as unknown as HomeAssistant;
}

async function mount(states: Record<string, string>): Promise<Card> {
  const el = document.createElement("onlycat-home-assistant-card");
  el.setConfig({ device_id: "oc_1" });
  el.hass = makeHass(states);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const text = (el: Card, sel: string) =>
  el.shadowRoot!.querySelector(sel)?.textContent?.trim();

describe("onlycat-home-assistant-card status", () => {
  let el: Card | undefined;
  afterEach(() => el?.remove());

  it.each([
    ["off", "Locked"],
    ["on", "Unlocked"],
    ["unavailable", "Unavailable"],
    ["unknown", "Unavailable"],
    [undefined, "Unavailable"],
  ])("lock state %s is shown as %s", async (state, label) => {
    el = await mount(state ? { "binary_sensor.oc_1_lock": state } : {});
    expect(text(el, ".pill--lock")).toBe(label);
  });

  it.each([
    ["on", "Connected"],
    ["off", "Offline"],
    ["unavailable", "Unavailable"],
  ])("connectivity state %s is shown as %s", async (state, label) => {
    el = await mount({ "binary_sensor.oc_1_connectivity": state });
    expect(text(el, ".pill--connectivity")).toBe(label);
  });

  it("disables actions whose entity is missing or unavailable", async () => {
    el = await mount({ "button.oc_1_unlock": "unavailable" });
    const [unlock, reboot] = [
      ...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".action-btn"),
    ];
    expect(unlock.disabled).toBe(true);
    expect(reboot.disabled).toBe(true);
    unlock.click();
    expect(el.hass.callService).not.toHaveBeenCalled();
  });

  it("presses the unlock button when available", async () => {
    el = await mount({ "button.oc_1_unlock": "2026-06-15T10:00:00+00:00" });
    const unlock = el.shadowRoot!.querySelector<HTMLButtonElement>(
      ".action-btn--primary",
    )!;
    expect(unlock.disabled).toBe(false);
    unlock.click();
    expect(el.hass.callService).toHaveBeenCalledWith("button", "press", {
      entity_id: "button.oc_1_unlock",
    });
  });
});
