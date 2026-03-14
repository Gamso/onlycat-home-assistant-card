import { LitElement, html, nothing, css } from "lit";
import { property, state } from "lit/decorators.js";
import { localize, localizeFormat } from "../localize/localize";

class OnlyCatCameraPanel extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @property() public entityId!: string;

  @state() private _showModal = false;

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

  /** URL of the last-activity video clip, if the integration exposes one. */
  private _getVideoUrl(): string | null {
    return (
      (this._entity()?.attributes?.video_url as string | undefined) ?? null
    );
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
    const videoUrl = this._getVideoUrl();
    const lastChanged = this._entity()?.last_changed as string | undefined;

    return html`
      <div
        class="camera-panel ${imgUrl ? "camera-panel--clickable" : ""}"
        @click=${() => {
          if (imgUrl) this._showModal = true;
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
                <ha-icon
                  icon="${videoUrl
                    ? "mdi:play-circle-outline"
                    : "mdi:image-outline"}"
                ></ha-icon>
                ${lastChanged
                  ? html`<span class="camera-ts"
                      >${this._relativeTime(lastChanged)}</span
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

      ${this._showModal
        ? html`
            <div
              class="modal-backdrop"
              @click=${(e: Event) => {
                if (e.target === e.currentTarget) this._showModal = false;
              }}
            >
              <div class="modal" role="dialog" aria-modal="true">
                <div class="modal-header">
                  <ha-icon icon="mdi:cctv"></ha-icon>
                  <span>${localize(this.hass, "camera.title")}</span>
                  <button
                    class="modal-close"
                    @click=${() => (this._showModal = false)}
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>
                <div class="modal-body">
                  ${videoUrl
                    ? html`<video
                        src="${videoUrl}"
                        class="modal-video"
                        controls
                        autoplay
                        playsinline
                        preload="metadata"
                        poster="${imgUrl ?? ""}"
                      ></video>`
                    : imgUrl
                      ? html`<img
                          src="${imgUrl}"
                          alt="${localize(this.hass, "camera.title")}"
                          class="modal-img"
                        />`
                      : html`<p class="modal-empty">
                          ${localize(this.hass, "camera.stream_unavailable")}
                        </p>`}
                </div>
              </div>
            </div>
          `
        : nothing}
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

    /* ── Modal ───────────────────────────────────────── */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.15s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal {
      background: var(--card-background-color);
      border-radius: 14px;
      max-width: 520px;
      width: 92%;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
      animation: slideUp 0.2s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.1));
      font-weight: 600;
      font-size: 0.95rem;
    }

    .modal-header ha-icon:first-child {
      color: var(--primary-color);
    }

    .modal-close {
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: background 0.15s;
    }

    .modal-close:hover {
      background: var(--secondary-background-color);
    }

    .modal-body {
      padding: 16px;
    }

    .modal-img {
      width: 100%;
      border-radius: 8px;
      display: block;
    }

    .modal-video {
      width: 100%;
      border-radius: 8px;
      display: block;
      background: #000;
    }

    .modal-empty {
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 0.875rem;
      margin: 0;
    }
  `;
}

customElements.define("onlycat-camera-panel", OnlyCatCameraPanel);

declare global {
  interface HTMLElementTagNameMap {
    "onlycat-camera-panel": OnlyCatCameraPanel;
  }
}
