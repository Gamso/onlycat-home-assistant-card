// ─── Camera panel helpers ─────────────────────────────────────────────────────

import { localize, localizeFormat } from "../localize/localize";
import type { HomeAssistant } from "../components/types";

/**
 * Snapshot URL of a camera entity, accepted only when it is HA's own
 * same-origin camera proxy (`/api/camera_proxy/<entity>?token=…`), so that a
 * misbehaving entity cannot make the dashboard load an arbitrary host.
 */
export function safeCameraUrl(entityPicture: unknown): string | null {
  if (typeof entityPicture !== "string") return null;
  return entityPicture.startsWith("/api/camera_proxy/") ? entityPicture : null;
}

/** "just now", "5 min ago", "3h ago", "3h05 ago", "2d ago" (localised). */
export function formatRelativeTime(
  hass: HomeAssistant | undefined,
  ts: number,
  now: number,
): string {
  const diff = Math.round((now - ts) / 60000);
  if (diff < 1) return localize(hass, "time.just_now");
  if (diff < 60) return localizeFormat(hass, "time.minutes_ago", { n: diff });
  const h = Math.floor(diff / 60);
  if (h >= 24) {
    return localizeFormat(hass, "time.days_ago", { d: Math.floor(h / 24) });
  }
  const m = diff % 60;
  if (m === 0) return localizeFormat(hass, "time.hours_ago", { h });
  return localizeFormat(hass, "time.hours_minutes_ago", {
    h,
    m: String(m).padStart(2, "0"),
  });
}
