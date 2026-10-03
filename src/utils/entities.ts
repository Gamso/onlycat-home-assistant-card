// ─── Entity resolution ────────────────────────────────────────────────────────
//
// The OnlyCat integration creates its entities as `<domain>.<prefix>_<suffix>`
// (prefix = OnlyCat device id, e.g. `oc_0cbfb5801849`). Users may rename them,
// so ids are resolved in this order for each role:
//   1. explicit override in the card config (`entities.<role>`);
//   2. the historical id `<domain>.<device_id>_<suffix>` if it exists;
//   3. the entity registry: entity of the HA device, platform "onlycat",
//      matched by translation key (stable across renames), then by suffix;
//   4. the historical id even if missing (the card then shows "unavailable").

import type { HomeAssistant, OnlyCatCardConfig } from "../components/types";

export const ONLYCAT_PLATFORM = "onlycat";

export const ENTITY_ROLES = {
  camera: {
    domain: "camera",
    key: "onlycat_last_activity_video",
    suffix: "last_activity_video",
  },
  image: {
    domain: "image",
    key: "onlycat_last_activity_image",
    suffix: "last_activity_image",
  },
  lock: { domain: "binary_sensor", key: "onlycat_lock_sensor", suffix: "lock" },
  connectivity: {
    domain: "binary_sensor",
    key: "onlycat_connection_sensor",
    suffix: "connectivity",
  },
  errors: {
    domain: "binary_sensor",
    key: "onlycat_error_sensor",
    suffix: "errors",
  },
  event: {
    domain: "binary_sensor",
    key: "onlycat_event_sensor",
    suffix: "event",
  },
  contraband: {
    domain: "binary_sensor",
    key: "onlycat_contraband_sensor",
    suffix: "contraband",
  },
  human: {
    domain: "binary_sensor",
    key: "onlycat_human_sensor",
    suffix: "human",
  },
  policy: { domain: "select", key: "onlycat_policy_select", suffix: "policy" },
  unlock: {
    domain: "button",
    key: "onlycat_unlock_button",
    suffix: "unlock",
  },
  reboot: {
    domain: "button",
    key: "onlycat_reboot_button",
    suffix: "reboot",
  },
} as const;

export type EntityRole = keyof typeof ENTITY_ROLES;
export type ResolvedEntities = Record<EntityRole, string>;

const ROLES = Object.keys(ENTITY_ROLES) as EntityRole[];

/** Historical id of `role` for the given entity-id prefix. */
export function legacyEntityId(prefix: string, role: EntityRole): string {
  const { domain, suffix } = ENTITY_ROLES[role];
  return prefix ? `${domain}.${prefix}_${suffix}` : "";
}

/** HA device registry id of the card's OnlyCat device, if it can be found. */
export function resolveDeviceId(
  hass: HomeAssistant | undefined,
  config: OnlyCatCardConfig,
): string | undefined {
  if (config.device) return config.device;
  const registry = hass?.entities;
  if (!registry) return undefined;
  for (const role of ROLES) {
    const candidates = [
      config.entities?.[role],
      legacyEntityId(config.device_id ?? "", role),
    ];
    for (const id of candidates) {
      const deviceId = id ? registry[id]?.device_id : undefined;
      if (deviceId) return deviceId;
    }
  }
  return undefined;
}

export function resolveEntities(
  hass: HomeAssistant | undefined,
  config: OnlyCatCardConfig,
): ResolvedEntities {
  const prefix = config.device_id ?? "";
  const deviceId = resolveDeviceId(hass, config);
  const deviceEntities = deviceId
    ? Object.values(hass?.entities ?? {}).filter(
        (e) =>
          !!e &&
          e.device_id === deviceId &&
          (e.platform === undefined || e.platform === ONLYCAT_PLATFORM),
      )
    : [];

  const out = {} as ResolvedEntities;
  for (const role of ROLES) {
    const { domain, key, suffix } = ENTITY_ROLES[role];
    const override = config.entities?.[role];
    const legacy = legacyEntityId(prefix, role);
    const inDomain = deviceEntities.filter((e) =>
      e!.entity_id.startsWith(`${domain}.`),
    );
    out[role] =
      override ||
      (legacy && hass?.states?.[legacy] ? legacy : "") ||
      inDomain.find((e) => e!.translation_key === key)?.entity_id ||
      inDomain.find((e) => e!.entity_id.endsWith(`_${suffix}`))?.entity_id ||
      legacy;
  }
  return out;
}

/** True when the config identifies a device one way or another. */
export function isConfigured(config: OnlyCatCardConfig | undefined): boolean {
  return !!(
    config &&
    (config.device ||
      config.device_id ||
      Object.values(config.entities ?? {}).some(Boolean))
  );
}
