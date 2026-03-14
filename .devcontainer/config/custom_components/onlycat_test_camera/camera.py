"""Static-file camera platform for OnlyCat devcontainer testing.

Usage in configuration.yaml:
  camera:
    - platform: onlycat_test_camera
      name: only_cat_last_activity_video   # → entity_id: camera.only_cat_last_activity_video
      file_path: /config/www/onlycat_card/snapshot.jpg
"""

from __future__ import annotations

import os
from typing import Any

import voluptuous as vol

from homeassistant.components.camera import Camera, PLATFORM_SCHEMA
from homeassistant.const import CONF_FILE_PATH, CONF_NAME
import homeassistant.helpers.config_validation as cv

VIDEO_URL = "/local/onlycat_card/video_test.mp4"
POSTER_URL = "/local/onlycat_card/video_poster.jpg"

PLATFORM_SCHEMA = PLATFORM_SCHEMA.extend(
    {
        vol.Required(CONF_FILE_PATH): cv.string,
        vol.Optional(CONF_NAME, default="OnlyCat Test Camera"): cv.string,
    }
)


async def async_setup_platform(hass, config, async_add_entities, discovery_info=None):
    """Set up the static-file camera."""
    async_add_entities(
        [StaticFileCamera(config[CONF_NAME], config[CONF_FILE_PATH])]
    )


class StaticFileCamera(Camera):
    """Camera entity that serves a static image file and exposes a test video."""

    def __init__(self, name: str, file_path: str) -> None:
        super().__init__()
        self._attr_name = name
        self._file_path = file_path
        self._attr_unique_id = f"onlycat_test_camera_{name}"

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Expose video_url and poster_url so the card can play the last-activity video."""
        return {"video_url": VIDEO_URL, "poster_url": POSTER_URL}

    def camera_image(
        self, width: int | None = None, height: int | None = None
    ) -> bytes | None:
        """Return the current camera image (static JPEG)."""
        try:
            with open(self._file_path, "rb") as f:
                return f.read()
        except OSError:
            return None
