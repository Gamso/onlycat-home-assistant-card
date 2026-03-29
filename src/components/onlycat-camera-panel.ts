import { LitElement, html, nothing, css } from "lit";
import { property } from "lit/decorators.js";
import { localize, localizeFormat } from "../localize/localize";

class OnlyCatCameraPanel extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @property() public entityId!: string;

  @property() public eventEntityId?: string;
  @property() public humanEntityId?: string;
  @property() public contrabandEntityId?: string;
  @property() public lastActivityEntityId?: string;

  private _entity() {
    return this.hass?.states?.[this.entityId];
  }

  /**
   * HA sets `entity_picture` on every camera entity automatically.
   * It is a relative URL (/api/camera_proxy/…?token=…) that the browser
   * resolves against the current HA origin — no need to reconstruct it.
   * Using it directly is exactly what HA's own camera card does.
   */
  private _getSnapshotUrl(): string | null {
    const ep = this._entity()?.attributes?.entity_picture as string | undefined;
    return ep ?? null;
  }

  /** Open the HA built-in more-info dialog for the camera entity (shows the HLS video stream). */
  private _openMoreInfo() {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId: this.entityId },
      }),
    );
  }

  /**
   * Returns the timestamp (ms) of the most recent activity.
   * Priority:
   *   1. lastActivity image entity (if available)
   *   2. event, human, contraband sensors
   */
  private _latestActivityTs(): number | null {
    // Home Assistant image entities expose their capture time in `state`.
    // Keep a few attribute fallbacks for integration-specific implementations.
    if (this.lastActivityEntityId) {
      const imageEntity = this.hass?.states?.[this.lastActivityEntityId];
      if (imageEntity) {
        const dateStr =
          imageEntity.state ||
          imageEntity.attributes?.datetime ||
          imageEntity.attributes?.last_activity ||
          imageEntity.attributes?.created_at;
        const ms = new Date(dateStr).getTime();
        if (!isNaN(ms)) {
          return ms;
        }
      }
    }
    // 2. Fallback to event, human, contraband sensors
    const ids = [
      this.eventEntityId,
      this.humanEntityId,
      this.contrabandEntityId,
    ];
    let latest: number | null = null;
    for (const id of ids) {
      if (!id) continue;
      const lc = this.hass?.states?.[id]?.last_changed as string | undefined;
      if (!lc) continue;
      const ms = new Date(lc).getTime();
      if (!isNaN(ms) && (latest === null || ms > latest)) {
        latest = ms;
      }
    }
    return latest;
  }

  private _relativeTime(isoString?: string): string {
    if (!isoString) return "";
    const dt = new Date(isoString);
    if (isNaN(dt.getTime())) return "";
    const diff = Math.round((Date.now() - dt.getTime()) / 60000);
    if (diff < 1) return localize(this.hass, "time.just_now");
    if (diff < 60)
      return localizeFormat(this.hass, "time.minutes_ago", { n: diff });
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (m === 0) return localizeFormat(this.hass, "time.hours_ago", { h });
    return localizeFormat(this.hass, "time.hours_minutes_ago", {
      h,
      m: String(m).padStart(2, "0"),
    });
  }

  protected render() {
    const imgUrl = this._getSnapshotUrl();
    const lastActivityTs = this._latestActivityTs();

    return html`
      <div
        class="camera-panel ${imgUrl ? "camera-panel--clickable" : ""}"
        @click=${() => {
          if (imgUrl) this._openMoreInfo();
        }}
      >
        ${imgUrl
          ? html`
              <img
                src="${imgUrl}"
                alt="${localize(this.hass, "camera.title")}"
                class="camera-img"
              />
              <div class="camera-overlay">
                <ha-icon icon="mdi:play-circle-outline"></ha-icon>
                ${lastActivityTs !== null
                  ? html`<span class="camera-ts"
                      >${this._relativeTime(
                        new Date(lastActivityTs).toISOString(),
                      )}</span
                    >`
                  : nothing}
              </div>
            `
          : html`
              <div class="camera-placeholder">
                <ha-icon icon="mdi:paw"></ha-icon>
                <span>${localize(this.hass, "card.no_recent_activity")}</span>
              </div>
            `}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    /* ── Thumbnail ───────────────────────────────────── */
    .camera-panel {
      position: relative;
      height: 160px;
      border-radius: 10px;
      overflow: hidden;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .camera-panel--clickable {
      cursor: pointer;
    }

    .camera-panel--clickable:hover .camera-overlay {
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
    }

    .camera-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .camera-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(transparent 40%, rgba(0, 0, 0, 0.55));
      display: flex;
      align-items: flex-end;
      gap: 6px;
      padding: 10px 12px;
      color: #fff;
      transition: background 0.2s;
    }

    .camera-overlay ha-icon {
      --mdc-icon-size: 22px;
    }

    .camera-ts {
      font-size: 0.8rem;
    }

    .camera-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: var(--secondary-text-color);
      opacity: 0.5;
    }

    .camera-placeholder ha-icon {
      --mdc-icon-size: 52px;
    }

    .camera-placeholder span {
      font-size: 0.85rem;
    }
  `;
}

customElements.define("onlycat-camera-panel", OnlyCatCameraPanel);

declare global {
  interface HTMLElementTagNameMap {
    "onlycat-camera-panel": OnlyCatCameraPanel;
  }
}
