import type {
  HomeAssistant,
  OnlyCatCardConfig,
  PassageKind,
  PetInfo,
} from "./types";

const TRACKER_PREFIX = "device_tracker.";
const TRACKER_SUFFIX = "_tracker";

/**
 * Pet colors, from the HA theme palette. Kept clear of the flap blue and of
 * the in (green) / out (orange) passage colors so a pet is never mistaken
 * for a direction.
 */
export const PET_PALETTE = [
  "var(--pink-color, #ec407a)",
  "var(--deep-purple-color, #7e57c2)",
  "var(--indigo-color, #5c6bc0)",
  "var(--brown-color, #8d6e63)",
  "var(--cyan-color, #26c6da)",
  "var(--blue-grey-color, #78909c)",
];

/** `device_tracker.<rfid>_tracker` → `<rfid>` (the integration's naming). */
export function rfidFromTracker(entityId: string): string {
  let id = entityId;
  if (id.startsWith(TRACKER_PREFIX)) id = id.slice(TRACKER_PREFIX.length);
  if (id.endsWith(TRACKER_SUFFIX)) id = id.slice(0, -TRACKER_SUFFIX.length);
  return id.toLowerCase();
}

/**
 * The integration names trackers "{pet_name}'s presence" (en) or
 * "{pet_name}s Anwesenheit" (de); strip that back to the pet's name.
 */
export function petNameFromFriendly(friendly: string | undefined): string {
  if (!friendly) return "";
  return friendly
    .replace(/[’']s presence$/i, "")
    .replace(/s Anwesenheit$/i, "")
    .trim();
}

function isOnlyCatTracker(
  hass: HomeAssistant | undefined,
  entityId: string,
): boolean {
  if (
    !entityId.startsWith(TRACKER_PREFIX) ||
    !entityId.endsWith(TRACKER_SUFFIX)
  ) {
    return false;
  }
  const reg = hass?.entities?.[entityId];
  // Older frontends don't expose the entity registry: fall back to the name.
  return reg ? reg.platform === "onlycat" : true;
}

/**
 * The integration creates a tracker for every chip it reads, including
 * visitors that aren't registered in the OnlyCat app. Those have no label,
 * so the integration names them after the RFID code itself.
 */
function isUnnamedVisitor(name: string, rfid: string): boolean {
  return name.toLowerCase() === rfid;
}

export function discoverPets(
  hass: HomeAssistant | undefined,
  config: OnlyCatCardConfig,
): PetInfo[] {
  const states = hass?.states ?? {};
  const entries =
    config.pets ??
    Object.keys(states)
      .filter((id) => isOnlyCatTracker(hass, id))
      .sort();

  const pets = entries.map((entry) => {
    const cfg = typeof entry === "string" ? { entity: entry } : entry;
    const friendly = states[cfg.entity]?.attributes?.friendly_name as
      | string
      | undefined;
    const rfid = rfidFromTracker(cfg.entity);
    return {
      entityId: cfg.entity,
      rfid,
      name: cfg.name || petNameFromFriendly(friendly) || rfid,
      color: cfg.color,
    };
  });

  // An explicit `pets` list is shown as given; discovery keeps named cats only.
  return pets
    .filter((pet) => config.pets || !isUnnamedVisitor(pet.name, pet.rfid))
    .map((pet, i) => ({
      ...pet,
      color: pet.color || PET_PALETTE[i % PET_PALETTE.length],
    }));
}

/** Mirrors the integration's `Pet.update_from_subevent`. */
export function classifyPassage(
  direction: string | undefined,
  action: string | undefined,
): PassageKind {
  const transit = !action || action === "TRANSIT";
  if (direction === "INWARD") return transit ? "in" : "in_attempt";
  if (direction === "OUTWARD") return transit ? "out" : "out_attempt";
  return "unknown";
}

/** True when the tracker state can't tell where the pet is. */
export function isUnavailable(state: string | undefined): boolean {
  return !state || state === "unavailable" || state === "unknown";
}

export function isOutside(state: string | undefined): boolean {
  return (
    !!state &&
    state !== "home" &&
    state !== "unknown" &&
    state !== "unavailable"
  );
}

export const PASSAGE_ICON: Record<PassageKind, string> = {
  in: "mdi:home-import-outline",
  out: "mdi:home-export-outline",
  in_attempt: "mdi:home-import-outline",
  out_attempt: "mdi:home-export-outline",
  unknown: "mdi:cat",
};

/** Theme colours; the --history-*-color variables stay available as overrides. */
const IN_COLOR = "var(--history-in-color, var(--success-color, #43a047))";
const OUT_COLOR = "var(--history-out-color, var(--warning-color, #fb8c00))";

export const PASSAGE_COLOR: Record<PassageKind, string> = {
  in: IN_COLOR,
  out: OUT_COLOR,
  in_attempt: IN_COLOR,
  out_attempt: OUT_COLOR,
  unknown: "var(--history-flap-color, var(--info-color, #039be5))",
};

export function isAttempt(kind: PassageKind): boolean {
  return kind === "in_attempt" || kind === "out_attempt";
}
