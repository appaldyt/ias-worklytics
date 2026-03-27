#!/usr/bin/env bash
set -euo pipefail

# Finds latest .zip in inbound media folder and installs it.
INBOUND_DIR="/root/.openclaw/media/inbound"
LATEST_ZIP="$(find "$INBOUND_DIR" -maxdepth 1 -type f -name '*.zip' -printf '%T@ %p\n' | sort -nr | head -n1 | awk '{print $2}')"

if [[ -z "${LATEST_ZIP:-}" ]]; then
  echo "❌ No .zip found in $INBOUND_DIR"
  exit 1
fi

echo "📦 Latest zip: $LATEST_ZIP"
"$(dirname "$0")/install-skill-zip.sh" "$LATEST_ZIP"
