import { LitElement, html, nothing, css } from "lit";
import { property } from "lit/decorators.js";
import { localize, localizeFormat } from "../localize/localize";
import { isOutside } from "./onlycat-pets";
import type { PetInfo } from "./types";

/** One chip per pet: inside / outside, and for how long. */
class OnlyCatPetStatus extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @property({ attribute: false }) public pets: PetInfo[] = [];

  private _since(isoString?: string): string {
    const ms = isoString ? new Date(isoString).getTime() : NaN;
    if (isNaN(ms)) return "";
    const min = Math.max(0, Math.floor((Date.now() - ms) / 60000));
    if (min < 1) return localize(this.hass, "time.just_now");
    if (min < 60) return localizeFormat(this.hass, "time.minutes", { n: min });
    const h = Math.floor(min / 60);
    if (h < 24) {
      return localizeFormat(this.hass, "time.hours_minutes", {
        h,
        m: String(min % 60).padStart(2, "0"),
      });
    }
    return localizeFormat(this.hass, "time.days", { d: Math.floor(h / 24) });
  }

  private _openMoreInfo(entityId: string) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId },
      }),
    );
  }

  protected render() {
    if (!this.pets.length) return nothing;
    return html`
      <div class="pets">
        ${this.pets.map((pet) => {
          const st = this.hass?.states?.[pet.entityId];
          const outside = isOutside(st?.state);
          const known = st?.state === "home" || outside;
          const label = !known
            ? localize(this.hass, "pets.unknown")
            : outside
              ? localize(this.hass, "pets.outside")
              : localize(this.hass, "pets.inside");
          const since = known ? this._since(st.last_changed) : "";
          return html`
            <button
              class="pet ${known
                ? outside
                  ? "pet--outside"
                  : "pet--inside"
                : "pet--unknown"}"
              style="--pet-color: ${pet.color}"
              title="${pet.name} · ${label}${since ? ` · ${since}` : ""}"
              @click=${() => this._openMoreInfo(pet.entityId)}
            >
              <ha-icon
                icon="${outside ? "mdi:tree-outline" : "mdi:home-outline"}"
              ></ha-icon>
              <span class="pet-name">${pet.name}</span>
              <span class="pet-state"
                >${label}${since ? html` · ${since}` : nothing}</span
              >
            </button>
          `;
        })}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .pets {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .pet {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      padding: 5px 10px 5px 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-left: 3px solid var(--pet-color);
      border-radius: 9px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      font-size: 0.8rem;
      cursor: pointer;
      transition: border-color 0.15s;
    }

    .pet:hover {
      border-color: var(--pet-color);
    }

    .pet ha-icon {
      --mdc-icon-size: 16px;
      flex-shrink: 0;
    }

    .pet--inside ha-icon {
      color: var(--history-in-color, #43a047);
    }

    .pet--outside ha-icon {
      color: var(--history-out-color, #fb8c00);
    }

    .pet--unknown {
      opacity: 0.6;
    }

    .pet-name {
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pet-state {
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
  `;
}

customElements.define("onlycat-pet-status", OnlyCatPetStatus);

declare global {
  interface HTMLElementTagNameMap {
    "onlycat-pet-status": OnlyCatPetStatus;
  }
}
