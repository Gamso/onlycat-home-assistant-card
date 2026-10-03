// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { formatRelativeTime, safeCameraUrl } from "../src/utils/camera";
import "../src/components/onlycat-camera-panel";
import type { HomeAssistant } from "../src/components/types";

const en = { locale: { language: "en" } } as unknown as HomeAssistant;
const MIN = 60_000;

describe("safeCameraUrl", () => {
  it("accepts only HA's camera proxy", () => {
    const ok = "/api/camera_proxy/camera.oc_1_last_activity_video?token=abc";
    expect(safeCameraUrl(ok)).toBe(ok);
    expect(safeCameraUrl("https://evil.example/x.jpg")).toBeNull();
    expect(safeCameraUrl("//evil.example/api/camera_proxy/x")).toBeNull();
    expect(safeCameraUrl("/local/x.jpg")).toBeNull();
    expect(safeCameraUrl(undefined)).toBeNull();
  });
});

describe("formatRelativeTime", () => {
  const now = Date.parse("2026-06-15T10:00:00Z");
  it.each([
    [0, "just now"],
    [5 * MIN, "5 min ago"],
    [180 * MIN, "3h ago"],
    [185 * MIN, "3h05 ago"],
    [72 * 60 * MIN, "3d ago"],
  ])("%d ms ago → %s", (delta, label) => {
    expect(formatRelativeTime(en, now - delta, now)).toBe(label);
  });
});

describe("onlycat-camera-panel", () => {
  afterEach(() => document.body.replaceChildren());

  it("opens the more-info dialog from the keyboard", async () => {
    const el = document.createElement("onlycat-camera-panel");
    el.hass = {
      ...en,
      states: {
        "camera.c": {
          entity_id: "camera.c",
          state: "idle",
          attributes: { entity_picture: "/api/camera_proxy/camera.c?token=t" },
        },
      },
    } as unknown as HomeAssistant;
    el.entityId = "camera.c";
    document.body.appendChild(el);
    await el.updateComplete;

    const panel = el.shadowRoot!.querySelector(".camera-panel") as HTMLElement;
    expect(panel.getAttribute("role")).toBe("button");
    expect(panel.getAttribute("tabindex")).toBe("0");
    let opened: unknown;
    el.addEventListener("hass-more-info", (e) => {
      opened = (e as CustomEvent).detail.entityId;
    });
    panel.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(opened).toBe("camera.c");
  });
});
