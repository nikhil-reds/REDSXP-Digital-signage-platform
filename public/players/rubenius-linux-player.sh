#!/usr/bin/env sh
set -eu

REGISTRATION_ID="__REGISTRATION_ID__"
INSTALL_TOKEN="__INSTALL_TOKEN__"
API_BASE_URL="__API_BASE_URL__"
INSTALL_ENDPOINT="__INSTALL_ENDPOINT__"
INSTALL_ID_FILE="${HOME}/.rubenius-player-install-id"

if [ -f "$INSTALL_ID_FILE" ]; then
  INSTALL_ID="$(cat "$INSTALL_ID_FILE")"
else
  INSTALL_ID="$(date +%s)-$(hostname)-$(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid)"
  printf "%s" "$INSTALL_ID" > "$INSTALL_ID_FILE"
fi

HOSTNAME_VALUE="$(hostname 2>/dev/null || printf "linux-player")"
OS_VERSION="$(uname -sr 2>/dev/null || printf "linux")"

curl -sS -X POST "$INSTALL_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"registrationId\":\"$REGISTRATION_ID\",\"installToken\":\"$INSTALL_TOKEN\",\"installId\":\"$INSTALL_ID\",\"hostname\":\"$HOSTNAME_VALUE\",\"osVersion\":\"$OS_VERSION\",\"appVersion\":\"1.0.0\"}"

printf "\nRubenius Linux Player registered with CMS at %s\n" "$API_BASE_URL"
