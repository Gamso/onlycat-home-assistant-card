import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import {
  localize,
  localizeFormat,
  type TranslationKey,
} from "../localize/localize";
import type { HomeAssistant, OnlyCatCardConfig } from "./types";
import {
  ENTITY_ROLES,
  ONLYCAT_PLATFORM,
  resolveDeviceId,
  type EntityRole,
} from "../utils/entities";
import { DEFAULT_HISTORY_DAYS } from "./onlycat-activity-history";

interface SchemaItem {
  name: string;
  type?: "expandable";
  flatten?: boolean;
  title?: string;
  selector?: Record<string, unknown>;
  schema?: SchemaItem[];
}

const ROLES = Object.keys(ENTITY_ROLES) as EntityRole[];

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<{
      createCardElement(config: { type: string }): HTMLElement;
    }>;
  }
}

/**
 * `ha-form` is part of the HA frontend but lazily loaded: make sure it is
 * defined by asking HA for a built-in card editor that uses it.
 */
async function ensureHaForm(): Promise<void> {
  if (customElements.get("ha-form")) return;
  try {
    const helpers = await window.loadCardHelpers?.();
    const card = helpers?.createCardElement({ type: "entities" });
    const ctor = card?.constructor as
      | { getConfigElement?: () => Promise<unknown> }
      | undefined;
    await ctor?.getConfigElement?.();
  } catch {
    // Older or unusual frontends: ha-form is then usually already loaded.
  }
}

/** Drops empty values so the YAML stays minimal. */
export function cleanConfig(config: OnlyCatCardConfig): OnlyCatCardConfig {
  const out: OnlyCatCardConfig = { ...config };
  const entities = Object.fromEntries(
    Object.entries(config.entities ?? {}).filter(([, v]) => !!v),
  );
  if (Object.keys(entities).length) out.entities = entities;
  else delete out.entities;
  if (!out.device_id) delete out.device_id;
  if (!out.device) delete out.device;
  if (out.history_days === undefined || out.history_days === null)
    delete out.history_days;
  return out;
}

class OnlyCatHomeAssistantCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: OnlyCatCardConfig;
  @state() private _formReady = !!customElements.get("ha-form");

  public setConfig(config: OnlyCatCardConfig): void {
    this._config = config;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this._formReady) {
      ensureHaForm().then(() => (this._formReady = true));
    }
  }

  private _schema(): SchemaItem[] {
    return [
      {
        name: "device",
        selector: { device: { filter: { integration: ONLYCAT_PLATFORM } } },
      },
      { name: "name", selector: { text: {} } },
      { name: "show_title", selector: { boolean: {} } },
      {
        name: "entities",
        type: "expandable",
        title: localize(this.hass, "editor.entities"),
        schema: ROLES.map((role) => ({
          name: role,
          selector: { entity: { domain: ENTITY_ROLES[role].domain } },
        })),
      },
      {
        name: "advanced",
        type: "expandable",
        flatten: true,
        title: localize(this.hass, "editor.advanced"),
        schema: [
          {
            name: "history_days",
            selector: {
              number: { min: 1, max: 365, mode: "box" },
            },
          },
          { name: "device_id", selector: { text: {} } },
        ],
      },
    ];
  }

  private _computeLabel = (item: SchemaItem): string => {
    const key = (
      item.name in ENTITY_ROLES ? `entity.${item.name}` : `editor.${item.name}`
    ) as TranslationKey;
    return localize(this.hass, key);
  };

  private _computeHelper = (item: SchemaItem): string | undefined => {
    if (item.name === "device")
      return localize(this.hass, "editor.device_hint");
    if (item.name === "device_id")
      return localize(this.hass, "editor.device_id_hint");
    if (item.name === "entities")
      return localize(this.hass, "editor.entities_hint");
    if (item.name === "history_days")
      return localizeFormat(this.hass, "editor.history_days_hint", {
        n: DEFAULT_HISTORY_DAYS,
      });
    return undefined;
  };

  private _valueChanged(ev: CustomEvent<{ value: OnlyCatCardConfig }>) {
    ev.stopPropagation();
    const value = { ...ev.detail.value };
    // Picking another device replaces the legacy entity-id prefix, which
    // would otherwise keep pointing to the previous device.
    const shown =
      this._config.device || resolveDeviceId(this.hass, this._config);
    if (value.device && value.device !== shown) delete value.device_id;
    this._config = cleanConfig(value);
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    if (!this._config || !this.hass || !this._formReady) return html``;
    const data: OnlyCatCardConfig = {
      show_title: true,
      ...this._config,
      // Existing YAML configs only have device_id: show the matching device.
      device: this._config.device || resolveDeviceId(this.hass, this._config),
    };
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${this._schema()}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
}

customElements.define(
  "onlycat-home-assistant-card-editor",
  OnlyCatHomeAssistantCardEditor,
);
