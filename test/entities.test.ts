import { describe, expect, it } from "vitest";
import {
  isConfigured,
  resolveDeviceId,
  resolveEntities,
} from "../src/utils/entities";
import type {
  HassEntityRegistryEntry,
  HomeAssistant,
} from "../src/components/types";

const DEVICE = "a1b2c3d4e5f6";

function hass(
  stateIds: string[],
  registry: HassEntityRegistryEntry[] = [],
): HomeAssistant {
  return {
    states: Object.fromEntries(
      stateIds.map((id) => [id, { entity_id: id, state: "on" }]),
    ),
    entities: Object.fromEntries(registry.map((e) => [e.entity_id, e])),
  } as unknown as HomeAssistant;
}

const reg = (
  entity_id: string,
  translation_key?: string,
  platform = "onlycat",
): HassEntityRegistryEntry => ({
  entity_id,
  device_id: DEVICE,
  platform,
  translation_key,
});

describe("resolveEntities", () => {
  it("keeps the historical ids of existing configs", () => {
    const ids = resolveEntities(
      hass(["binary_sensor.oc_1_lock", "button.oc_1_unlock"]),
      { device_id: "oc_1" },
    );
    expect(ids.lock).toBe("binary_sensor.oc_1_lock");
    expect(ids.unlock).toBe("button.oc_1_unlock");
    // Missing entities still get the historical id (shown as unavailable).
    expect(ids.camera).toBe("camera.oc_1_last_activity_video");
  });

  it("finds renamed entities through the device registry", () => {
    const h = hass(
      ["binary_sensor.oc_1_connectivity", "binary_sensor.chatiere_verrou"],
      [
        reg("binary_sensor.oc_1_connectivity", "onlycat_connection_sensor"),
        reg("binary_sensor.chatiere_verrou", "onlycat_lock_sensor"),
        reg("binary_sensor.chatiere_humain", "onlycat_human_sensor"),
        reg("select.chatiere_politique", "onlycat_policy_select"),
      ],
    );
    const ids = resolveEntities(h, { device_id: "oc_1" });
    expect(ids.connectivity).toBe("binary_sensor.oc_1_connectivity");
    expect(ids.lock).toBe("binary_sensor.chatiere_verrou");
    expect(ids.human).toBe("binary_sensor.chatiere_humain");
    expect(ids.policy).toBe("select.chatiere_politique");
  });

  it("resolves from the HA device id alone", () => {
    const h = hass(
      [],
      [
        reg("binary_sensor.oc_9_lock", "onlycat_lock_sensor"),
        reg("binary_sensor.oc_9_event"), // no translation key: suffix match
        reg("binary_sensor.other_lock", "onlycat_lock_sensor", "shelly"),
      ],
    );
    const ids = resolveEntities(h, { device: DEVICE });
    expect(ids.lock).toBe("binary_sensor.oc_9_lock");
    expect(ids.event).toBe("binary_sensor.oc_9_event");
    expect(ids.reboot).toBe("");
  });

  it("lets explicit overrides win", () => {
    const ids = resolveEntities(
      hass(["binary_sensor.oc_1_lock"], [reg("binary_sensor.oc_1_lock")]),
      { device_id: "oc_1", entities: { lock: "binary_sensor.my_lock" } },
    );
    expect(ids.lock).toBe("binary_sensor.my_lock");
  });
});

describe("resolveDeviceId / isConfigured", () => {
  it("derives the HA device from a known entity", () => {
    const h = hass([], [reg("binary_sensor.oc_1_connectivity")]);
    expect(resolveDeviceId(h, { device_id: "oc_1" })).toBe(DEVICE);
    expect(resolveDeviceId(h, { device_id: "oc_2" })).toBeUndefined();
  });

  it("requires a device, a prefix or an override", () => {
    expect(isConfigured({})).toBe(false);
    expect(isConfigured({ device_id: "" })).toBe(false);
    expect(isConfigured({ device: DEVICE })).toBe(true);
    expect(isConfigured({ device_id: "oc_1" })).toBe(true);
    expect(isConfigured({ entities: { lock: "binary_sensor.x" } })).toBe(true);
  });
});

describe("resolveEntities with both device and device_id", () => {
  it("ignores a legacy prefix that belongs to another device", () => {
    const h = hass(
      ["binary_sensor.oc_old_lock", "binary_sensor.oc_new_lock"],
      [
        { ...reg("binary_sensor.oc_old_lock"), device_id: "other" },
        reg("binary_sensor.oc_new_lock", "onlycat_lock_sensor"),
      ],
    );
    const ids = resolveEntities(h, { device: DEVICE, device_id: "oc_old" });
    expect(ids.lock).toBe("binary_sensor.oc_new_lock");
  });
});
