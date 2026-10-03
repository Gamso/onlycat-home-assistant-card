// ─── Shared types ─────────────────────────────────────────────────────────────

import type { EntityRole } from "../utils/entities";

/** Subset of the Home Assistant frontend `hass` object used by the card. */
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

/** Entry of `hass.entities` (entity registry, display subset). */
export interface HassEntityRegistryEntry {
  entity_id: string;
  device_id?: string;
  platform?: string;
  translation_key?: string;
}

export interface HassLocale {
  language?: string;
  /** "language" | "system" | "12" | "24" */
  time_format?: string;
  /** "local" | "server" */
  time_zone?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  entities?: Record<string, HassEntityRegistryEntry | undefined>;
  config?: { time_zone?: string };
  locale?: HassLocale;
  language?: string;
  callApi<T>(method: "GET" | "POST", path: string): Promise<T>;
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<unknown>;
  formatEntityState?(stateObj: HassEntity, state?: string): string;
}
/** A pet as configured in YAML: either a device_tracker id or an object. */
export type PetConfigEntry =
  | string
  | { entity: string; name?: string; color?: string };

export interface OnlyCatCardConfig {
  name?: string;
  /** HA device registry id of the OnlyCat device (set by the visual editor). */
  device?: string;
  /** OnlyCat device id used as entity-id prefix, e.g. `oc_0cbfb5801849`. */
  device_id?: string;
  /** Per-role entity overrides, for renamed entities. */
  entities?: Partial<Record<EntityRole, string>>;
  show_title?: boolean;
  /** Number of past days reachable in the history frise (default 10). */
  history_days?: number;
  /** Pet trackers to show; auto-discovered from the onlycat platform if omitted. */
  pets?: PetConfigEntry[];
  /** Show the per-pet presence chips (default: true). */
  show_pets?: boolean;
}

export interface PetInfo {
  /** device_tracker.<rfid>_tracker */
  entityId: string;
  /** RFID code parsed from the entity id, lower-cased. */
  rfid: string;
  name: string;
  color: string;
}

/**
 * What a flap passage actually was, from the event summary's
 * `direction` + `action` attributes. An `*_attempt` is a passage that did not
 * go through (the integration only counts `action == TRANSIT` as crossing).
 */
export type PassageKind =
  | "in"
  | "out"
  | "in_attempt"
  | "out_attempt"
  | "unknown";

/** One "on" period of a binary sensor (epoch ms). */
export interface ParsedPeriod {
  startTs: number;
  endTs: number;
}

/** A flap event, enriched with the attributes the integration attaches to it. */
export interface Passage extends ParsedPeriod {
  eventId?: number;
  kind: PassageKind;
  /** RFID codes seen during the event, lower-cased. */
  rfids: string[];
}

/** HA websocket history, compressed format (`history/history_during_period`). */
export interface CompressedState {
  s: string;
  a?: Record<string, unknown>;
  /** seconds since epoch; omitted when equal to `lu` */
  lc?: number;
  lu: number;
}
