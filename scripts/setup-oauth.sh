#!/bin/bash
# ─────────────────────────────────────────────────
# setup-oauth.sh
# Creates a standard Google OAuth 2.0 Web Client
# and stores credentials in Secret Manager.
#
# Usage: ./scripts/setup-oauth.sh
# ─────────────────────────────────────────────────

set -euo pipefail

PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
HOSTING_URL="https://${PROJECT_ID}.web.app"
LOCAL_URL="http://localhost:5173"
DOMAIN_1="https://reaitro.com"
DOMAIN_2="https://airetrotool.com"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  RetroBoard OAuth Setup"
echo "  Project: $PROJECT_ID ($PROJECT_NUMBER)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Configure the OAuth consent screen
echo ""
echo "→ Step 1: Configuring OAuth consent screen..."
ACCESS_TOKEN=$(gcloud auth print-access-token)

# Check if consent screen already exists
BRAND_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://iap.googleapis.com/v1/projects/${PROJECT_NUMBER}/brands" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

if [ "$BRAND_EXISTS" = "200" ]; then
  BRAND_COUNT=$(curl -s \
    "https://iap.googleapis.com/v1/projects/${PROJECT_NUMBER}/brands" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" | python3 -c "import sys,json; data=json.load(sys.stdin); print(len(data.get('brands',[])))" 2>/dev/null || echo "0")
  
  if [ "$BRAND_COUNT" != "0" ]; then
    echo "  ✓ OAuth consent screen already exists"
  fi
fi

# Step 2: Create the OAuth 2.0 Web Client
echo ""
echo "→ Step 2: Creating OAuth 2.0 Web Application client..."

# Use the Google Cloud API to create a standard web OAuth client
RESULT=$(curl -s -X POST \
  "https://oauth2.googleapis.com/v1/projects/${PROJECT_NUMBER}/oauthClients" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"displayName\": \"RetroBoard Web Client\",
    \"applicationType\": \"WEB\",
    \"allowedRedirectUris\": [
      \"${HOSTING_URL}/login?provider=google\",
      \"${LOCAL_URL}/login?provider=google\"
    ],
    \"allowedJavascriptOrigins\": [
      \"${HOSTING_URL}\",
      \"${LOCAL_URL}\"
    ]
  }" 2>/dev/null)

# Check if it worked, if not try the alternative API
CLIENT_ID=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('clientId',''))" 2>/dev/null || echo "")
CLIENT_SECRET=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('clientSecret',''))" 2>/dev/null || echo "")

if [ -z "$CLIENT_ID" ]; then
  echo ""
  echo "⚠  Automated OAuth client creation requires manual setup."
  echo ""
  echo "Please create the OAuth client manually:"
  echo ""
  echo "  1. Go to: https://console.cloud.google.com/apis/credentials?project=${PROJECT_ID}"
  echo "  2. Click '+ CREATE CREDENTIALS' → 'OAuth client ID'"
  echo "  3. Application type: 'Web application'"
  echo "  4. Name: 'RetroBoard Web Client'"
  echo "  5. Authorized JavaScript origins:"
  echo "     • ${HOSTING_URL}"
  echo "     • ${DOMAIN_1}"
  echo "     • ${DOMAIN_2}"
  echo "     • ${LOCAL_URL}"
  echo "  6. Authorized redirect URIs:"
  echo "     • ${HOSTING_URL}/login?provider=google"
  echo "     • ${DOMAIN_1}/login?provider=google"
  echo "     • ${DOMAIN_2}/login?provider=google"
  echo "     • ${LOCAL_URL}/login?provider=google"
  echo "  7. Click 'CREATE'"
  echo ""
  read -p "  Enter the Client ID: " CLIENT_ID
  read -p "  Enter the Client Secret: " CLIENT_SECRET
fi

if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
  echo "✗ Error: Client ID and Secret are required."
  exit 1
fi

echo "  ✓ OAuth Client ID: ${CLIENT_ID}"

# Step 3: Store in Secret Manager
echo ""
echo "→ Step 3: Storing credentials in Secret Manager..."

SECRET_DATA=$(printf '{"GOOGLE_CLIENT_ID":"%s","GOOGLE_CLIENT_SECRET":"%s"}' "$CLIENT_ID" "$CLIENT_SECRET")

# Check if secret version already exists and add a new one
gcloud secrets versions add google-oauth-credentials \
  --project="$PROJECT_ID" \
  --data-file=- <<< "$SECRET_DATA" 2>/dev/null || \
gcloud secrets create google-oauth-credentials \
  --project="$PROJECT_ID" \
  --replication-policy="automatic" && \
gcloud secrets versions add google-oauth-credentials \
  --project="$PROJECT_ID" \
  --data-file=- <<< "$SECRET_DATA"

echo "  ✓ Credentials stored in Secret Manager"

# Step 4: Update frontend config
echo ""
echo "→ Step 4: Updating frontend config.json..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/frontend/src/assets/config.json"
if [ -f "$CONFIG_FILE" ]; then
  python3 -c "
import json
with open('$CONFIG_FILE', 'r') as f:
    config = json.load(f)
config['google']['clientId'] = '$CLIENT_ID'
with open('$CONFIG_FILE', 'w') as f:
    json.dump(config, f, indent=2)
print('  ✓ Updated $CONFIG_FILE')
"
else
  echo "  ⚠ Config file not found at $CONFIG_FILE"
  echo "  Update manually: set google.clientId to: $CLIENT_ID"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ OAuth setup complete!"
echo ""
echo "  Client ID:     $CLIENT_ID"
echo "  Secret:        Stored in Secret Manager"
echo "  Hosting URL:   $HOSTING_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
