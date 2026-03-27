#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./install-skill-zip.sh /path/to/skill.zip
#
# Installs a skill zip into /root/.openclaw/workspace/skills/<skill-folder>
# Then validates SKILL.md and optionally restarts gateway.

ZIP_PATH="${1:-}"
SKILLS_DIR="/root/.openclaw/workspace/skills"
TMP_DIR="/tmp/openclaw-skill-install"

if [[ -z "$ZIP_PATH" ]]; then
  echo "❌ Usage: $0 /path/to/skill.zip"
  exit 1
fi

if [[ ! -f "$ZIP_PATH" ]]; then
  echo "❌ File not found: $ZIP_PATH"
  exit 1
fi

if [[ "$ZIP_PATH" != *.zip ]]; then
  echo "❌ File must be .zip"
  exit 1
fi

echo "📦 Installing skill from: $ZIP_PATH"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR" "$SKILLS_DIR"

unzip -q "$ZIP_PATH" -d "$TMP_DIR"

# detect candidate folder containing SKILL.md
CANDIDATE=""
if [[ -f "$TMP_DIR/SKILL.md" ]]; then
  CANDIDATE="$TMP_DIR"
else
  CANDIDATE="$(find "$TMP_DIR" -maxdepth 3 -type f -name SKILL.md -print -quit | xargs -r dirname)"
fi

if [[ -z "$CANDIDATE" ]]; then
  echo "❌ SKILL.md not found in zip. Not a valid OpenClaw skill package."
  exit 1
fi

SKILL_NAME="$(basename "$CANDIDATE")"
DEST_DIR="$SKILLS_DIR/$SKILL_NAME"

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"
cp -R "$CANDIDATE"/* "$DEST_DIR"/

if [[ ! -f "$DEST_DIR/SKILL.md" ]]; then
  echo "❌ Install failed: SKILL.md missing in destination"
  exit 1
fi

echo "✅ Installed skill: $SKILL_NAME"
echo "📁 Location: $DEST_DIR"

# basic validation output
head -n 20 "$DEST_DIR/SKILL.md" || true

echo "\n🔁 If skill not detected immediately, restart gateway:"
echo "openclaw gateway restart"
