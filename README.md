# OnlyCat Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)

A custom [Home Assistant](https://www.home-assistant.io/) Lovelace card to monitor
and control your **OnlyCat** smart cat flap via the
[onlycat-home-assistant](https://github.com/OnlyCatAI/onlycat-home-assistant)
integration.

![Card Preview](assets/card_preview.png)

---

## Features

| Feature              | Description                                                                 | Entity used                                                  |
| -------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 📷 Camera snapshot   | Last activity snapshot; tap (or Enter) opens the HA more-info dialog with the video stream | `camera.<device_id>_last_activity_video`                     |
| 🕒 Last activity     | "x min ago" label on the snapshot, from the image entity or the event sensors | `image.<device_id>_last_activity_image`                      |
| 🔒 Lock status       | Locked / Unlocked pill, "Unavailable" when the sensor is missing or offline | `binary_sensor.<device_id>_lock`                             |
| 📡 Connectivity      | Connected / Offline pill, "Unavailable" when the sensor is missing           | `binary_sensor.<device_id>_connectivity`                     |
| ⚠️ Device errors     | Warning icon in the header while the device reports errors                  | `binary_sensor.<device_id>_errors`                           |
| 🚪 Door policy       | Drop-down selector of the device policies                                   | `select.<device_id>_policy`                                  |
| 🔓 Unlock button     | One-tap unlock (disabled when the entity is unavailable)                    | `button.<device_id>_unlock`                                  |
| 🔄 Reboot button     | Reboot with confirmation dialog (disabled when the entity is unavailable)   | `button.<device_id>_reboot`                                  |
| 📊 Activity timeline | Collapsible day-by-day timeline with zoom                                   | `binary_sensor.<device_id>_event` · `_contraband` · `_human` · `_lock` |

### Activity timeline detail

- **3 rows**: Passage (flap), Prey detected, Human detected — each as a colored timeline bar.
- **Calendar-day navigation** with ◄ ► arrows to browse past days (up to `history_days`, 10 by default).
  Days run from midnight to midnight in the time zone of your HA profile (server zone by default), like the HA history panel.
- **Tooltip** on each bar shows start time, end time and duration.
- **Zoom overlay**: hover a bar with a mouse, or tap it on a touch screen, to open a magnified window centered on the event,
  with ◄ ► buttons to move to the previous/next event and a close button.
  A lock icon marks passages that coincide with an unlock (`binary_sensor.<device_id>_lock`).

### Languages

English and French, following the language of the HA user profile.

---

## Installation

### HACS (recommended)

1. Add this repository to HACS as a custom **Dashboard** (frontend) repository.
2. Search for **OnlyCat Card** and install it.
3. HACS automatically registers the JS resource.

### Manual

1. Download `onlycat-home-assistant-card.js` from the latest [release](https://github.com/Gamso/onlycat-home-assistant-card/releases)
   (or from the `dist/` folder) and copy it to `<config>/www/`.
2. In **Settings → Dashboards → ⋮ → Resources**, add `/local/onlycat-home-assistant-card.js` as a **JavaScript module**.
3. Reload the browser.

---

## Configuration

The visual editor lets you pick the OnlyCat device (only devices of the OnlyCat integration are listed).

### Minimal

```yaml
type: custom:onlycat-home-assistant-card
device: 3f1c0e8a9b7d4c2e8f6a1b2c3d4e5f60 # HA device, as set by the visual editor
```

or, as in earlier versions, with the OnlyCat device id:

```yaml
type: custom:onlycat-home-assistant-card
device_id: oc_0cbfb5801849
```

### Full options

```yaml
type: custom:onlycat-home-assistant-card
device: 3f1c0e8a9b7d4c2e8f6a1b2c3d4e5f60 # HA device of the cat flap (or device_id below)
device_id: oc_0cbfb5801849 # OnlyCat device id, prefix of the entity ids
name: "Cat flap" # Optional — card title
show_title: true # Optional — show the card title bar (default: true)
history_days: 10 # Optional — past days reachable in the timeline (default: 10)
entities: # Optional — only for entities you renamed
  lock: binary_sensor.cat_flap_lock
  policy: select.cat_flap_policy
```

Entities are found automatically: the ids listed above when they exist, otherwise the entities of the
device in the entity registry (so renamed entities keep working). The `entities` keys are `camera`, `image`,
`lock`, `connectivity`, `errors`, `event`, `contraband`, `human`, `policy`, `unlock` and `reboot`.

### Theming

Colors follow the HA theme (`--success-color`, `--warning-color`, `--info-color`, `--error-color`).
The timeline rows can be recolored with `--history-flap-color`, `--history-contraband-color` and
`--history-human-color`.

---

## Development

```bash
npm ci
npm run build      # dist/onlycat-home-assistant-card.js (committed, used by HACS)
npm run watch      # rebuild on change, with a source map
npm test           # Vitest
npm run lint && npm run typecheck
```

The `.devcontainer` starts a Home Assistant instance with simulated OnlyCat entities.

---

## License

[MIT](LICENSE)
