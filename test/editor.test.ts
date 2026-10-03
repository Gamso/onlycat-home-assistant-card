// @vitest-environment happy-dom
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import type { HomeAssistant, OnlyCatCardConfig } from "../src/components/types";

/** Stand-in for HA's lazily loaded ha-form: keeps what the editor passes. */
class FakeHaForm extends HTMLElement {
  data?: OnlyCatCardConfig;
  schema?: Array<{ name: string; selector?: Record<string, unknown> }>;
}

beforeAll(async () => {
  customElements.define("ha-form", FakeHaForm);
  await import("../src/components/onlycat-home-assistant-card-editor");
});

const hass = {
  states: {},
  entities: {
    "binary_sensor.oc_1_connectivity": {
      entity_id: "binary_sensor.oc_1_connectivity",
      device_id: "dev1",
      platform: "onlycat",
    },
  },
  locale: { language: "en" },
} as unknown as HomeAssistant;

type Editor = HTMLElement & {
  hass: HomeAssistant;
  setConfig(c: OnlyCatCardConfig): void;
  updateComplete: Promise<boolean>;
};

async function mount(config: OnlyCatCardConfig) {
  const el = document.createElement(
    "onlycat-home-assistant-card-editor",
  ) as Editor;
  el.hass = hass;
  el.setConfig(config);
  document.body.appendChild(el);
  await el.updateComplete;
  const form = el.shadowRoot!.querySelector("ha-form") as FakeHaForm;
  const changes: OnlyCatCardConfig[] = [];
  el.addEventListener("config-changed", (e) =>
    changes.push((e as CustomEvent).detail.config),
  );
  const emit = (value: OnlyCatCardConfig) =>
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value } }));
  return { el, form, changes, emit };
}

describe("onlycat-home-assistant-card-editor", () => {
  afterEach(() => document.body.replaceChildren());

  it("offers only OnlyCat devices in a device selector", async () => {
    const { form } = await mount({ device: "" });
    const device = form.schema!.find((s) => s.name === "device")!;
    expect(device.selector).toEqual({
      device: { filter: { integration: "onlycat" } },
    });
  });

  it("shows the device of a legacy device_id config without rewriting it", async () => {
    const { form, changes, emit } = await mount({ device_id: "oc_1" });
    expect(form.data!.device).toBe("dev1");
    emit({ ...form.data!, name: "Chatière" });
    expect(changes[changes.length - 1]).toEqual({
      device_id: "oc_1",
      device: "dev1",
      name: "Chatière",
      show_title: true,
      show_pets: true,
    });
  });

  it("drops the legacy prefix when another device is picked", async () => {
    const { form, changes, emit } = await mount({ device_id: "oc_1" });
    emit({ ...form.data!, device: "dev2", entities: { lock: "" } });
    expect(changes[changes.length - 1]).toEqual({
      device: "dev2",
      show_title: true,
      show_pets: true,
    });
  });
});
