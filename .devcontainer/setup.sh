#!/bin/bash
set -e

echo "════════════════════════════════════════════════════"
echo "  OnlyCat Card – Home Assistant DevContainer setup"
echo "════════════════════════════════════════════════════"
echo ""

WORKSPACE=/workspaces/onlycat-home-assistant-card
CONFIG=/config

# ── Directories ──────────────────────────────────────────────────────────────
mkdir -p "$CONFIG/www/onlycat_card"
mkdir -p "$CONFIG/.storage"
mkdir -p "$CONFIG/custom_components"

# ── configuration.yaml ───────────────────────────────────────────────────────
if [ ! -f "$CONFIG/configuration.yaml" ] || \
   [ "$WORKSPACE/.devcontainer/config/configuration.yaml" -nt "$CONFIG/configuration.yaml" ]; then
  echo "📝 Copying configuration.yaml..."
  cp "$WORKSPACE/.devcontainer/config/configuration.yaml" "$CONFIG/configuration.yaml"
  echo "   ✅ Done"
fi

# ── Card JS file ─────────────────────────────────────────────────────────────
if [ -f "$WORKSPACE/dist/onlycat-home-assistant-card.js" ]; then
  echo "✅ onlycat-home-assistant-card.js found in dist/ – mounted automatically via devcontainer."
else
  echo ""
  echo "⚠️  WARNING: dist/onlycat-home-assistant-card.js not found."
  echo ""
  echo "   Build the card first on your HOST machine:"
  echo "   1. cd $WORKSPACE"
  echo "   2. npm install"
  echo "   3. npm run build"
  echo ""
  echo "   The dist/ folder is mounted into /config/www/onlycat_card/,"
  echo "   so the card will appear automatically after building."
fi

# ── Test media assets ────────────────────────────────────────────────────────
echo "📹 Copying test media files to www/onlycat_card/..."
for f in video_test.mp4 video_poster.jpg; do
  src="$WORKSPACE/.devcontainer/$f"
  dst="$CONFIG/www/onlycat_card/$f"
  if [ -f "$src" ]; then
    cp "$src" "$dst" && echo "   ✅ $f"
  else
    echo "   ⚠️  $f not found in .devcontainer/"
  fi
done

# ── Inject test history into recorder DB ─────────────────────────────────────
echo ""
echo "💉 Injecting OnlyCat test history into recorder DB..."
python3 "$WORKSPACE/.devcontainer/inject_history.py" && echo "   ✅ Done" || echo "   ⚠️  Injection failed (DB may not exist yet – first boot will create it)."

# ── Start Home Assistant ─────────────────────────────────────────────────────
echo ""
echo "🚀 Starting Home Assistant..."
nohup python3 -m homeassistant --config "$CONFIG" > "$CONFIG/home-assistant.log" 2>&1 &
echo "   PID: $!"

echo ""
echo "✅ Setup complete!"
echo ""
echo "⏳ Home Assistant is starting (1–2 min for first boot)."
echo "   → http://localhost:8123"
echo ""
echo "📋 First-run steps:"
echo "   1. Complete the onboarding wizard (create an admin account)."
echo "   2. Profile (bottom-left) → enable Advanced Mode."
echo "   3. The 'OnlyCat Dev' dashboard should appear automatically."
echo ""
echo "🔧 Simulate entities from the Home Assistant UI:"
echo "   Settings → Devices & Services → Helpers"
echo "   (search for 'only_cat' to find all fake OnlyCat entities)"
echo ""
echo "📦 Rebuild card (run on HOST, not inside container):"
echo "   npm run build   (or: npm run watch)"
echo "   Then hard-refresh the browser (Ctrl+Shift+R)."
echo ""

sleep 2
