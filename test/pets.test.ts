import { describe, expect, it } from "vitest";
import {
  PET_PALETTE,
  classifyPassage,
  discoverPets,
  isOutside,
  isUnavailable,
  petNameFromFriendly,
  rfidFromTracker,
} from "../src/components/onlycat-pets";
import type { HomeAssistant } from "../src/components/types";

const MINOU = "device_tracker.900123000000001_tracker";
const FILOU = "device_tracker.900123000000002_tracker";
const VISITOR = "device_tracker.999000000000999_tracker";

function makeHass(
  trackers: Record<string, string>,
  platform?: Record<string, string>,
): HomeAssistant {
  return {
    states: Object.fromEntries(
      Object.entries(trackers).map(([id, name]) => [
        id,
        { entity_id: id, state: "home", attributes: { friendly_name: name } },
      ]),
    ),
    ...(platform
      ? {
          entities: Object.fromEntries(
            Object.entries(platform).map(([id, p]) => [
              id,
              { entity_id: id, platform: p },
            ]),
          ),
        }
      : {}),
  } as unknown as HomeAssistant;
}

describe("tracker naming", () => {
  it("reads the RFID code from the tracker id", () => {
    expect(rfidFromTracker("device_tracker.900ABC_tracker")).toBe("900abc");
  });

  it("strips the integration's presence suffix from the name", () => {
    expect(petNameFromFriendly("Minou's presence")).toBe("Minou");
    expect(petNameFromFriendly("Minou’s presence")).toBe("Minou");
    expect(petNameFromFriendly("Minous Anwesenheit")).toBe("Minou");
    expect(petNameFromFriendly(undefined)).toBe("");
  });
});

describe("discoverPets", () => {
  it("keeps named OnlyCat trackers and leaves anonymous visitors out", () => {
    const hass = makeHass({
      [MINOU]: "Minou's presence",
      [FILOU]: "Filou's presence",
      // Visitors have no label: the integration names them after the chip.
      [VISITOR]: "999000000000999's presence",
      "device_tracker.phone": "Phone",
    });
    expect(discoverPets(hass, {})).toEqual([
      { entityId: MINOU, rfid: "900123000000001", name: "Minou", color: PET_PALETTE[0] },
      { entityId: FILOU, rfid: "900123000000002", name: "Filou", color: PET_PALETTE[1] },
    ]);
  });

  it("only takes trackers of the onlycat platform when the registry is known", () => {
    const hass = makeHass(
      { [MINOU]: "Minou's presence", [FILOU]: "Filou's presence" },
      { [MINOU]: "onlycat", [FILOU]: "other" },
    );
    expect(discoverPets(hass, {}).map((p) => p.name)).toEqual(["Minou"]);
  });

  it("shows an explicit pets list as given, visitors included", () => {
    const hass = makeHass({ [VISITOR]: "999000000000999's presence" });
    expect(
      discoverPets(hass, {
        pets: [VISITOR, { entity: FILOU, name: "Filou", color: "#123456" }],
      }),
    ).toEqual([
      { entityId: VISITOR, rfid: "999000000000999", name: "999000000000999", color: PET_PALETTE[0] },
      { entityId: FILOU, rfid: "900123000000002", name: "Filou", color: "#123456" },
    ]);
  });
});

describe("classifyPassage", () => {
  it.each([
    ["INWARD", "TRANSIT", "in"],
    ["OUTWARD", "TRANSIT", "out"],
    ["INWARD", undefined, "in"],
    ["INWARD", "NONE", "in_attempt"],
    ["OUTWARD", "NONE", "out_attempt"],
    [undefined, "TRANSIT", "unknown"],
  ])("%s / %s is %s", (direction, action, kind) => {
    expect(classifyPassage(direction, action)).toBe(kind);
  });
});

describe("tracker states", () => {
  it("tells outside from inside and from unavailable", () => {
    expect(isOutside("not_home")).toBe(true);
    expect(isOutside("home")).toBe(false);
    expect(isOutside("unavailable")).toBe(false);
    expect(isUnavailable("unknown")).toBe(true);
    expect(isUnavailable(undefined)).toBe(true);
    expect(isUnavailable("not_home")).toBe(false);
  });
});
