// ─── Shared types ─────────────────────────────────────────────────────────────

/** A pet as configured in YAML: either a device_tracker id or an object. */
export type PetConfigEntry =
  | string
  | { entity: string; name?: string; color?: string };

export interface OnlyCatCardConfig {
  name?: string;
  device_id: string;
  show_title?: boolean;
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

export interface ParsedPeriod {
  /** 0–1 fraction within the query range */
  start: number;
  end: number;
  /** Actual ms timestamps for tooltip display */
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
  a?: Record<string, any>;
  /** seconds since epoch; omitted when equal to `lu` */
  lc?: number;
  lu: number;
}
