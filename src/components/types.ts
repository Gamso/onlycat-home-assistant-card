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
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<unknown>;
  formatEntityState?(stateObj: HassEntity, state?: string): string;
}

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
}

export type HistoryStateFull = {
  entity_id: string;
  state: string;
  last_changed: string;
};

// HA omits `lc` when last_changed == last_updated (only `lu` is sent).
export type HistoryStateMinimal = { s: string; lc?: number; lu?: number };

export type HistoryEntry = HistoryStateFull | HistoryStateMinimal;

/** One "on" period of a binary sensor (epoch ms). */
export interface ParsedPeriod {
  startTs: number;
  endTs: number;
}
