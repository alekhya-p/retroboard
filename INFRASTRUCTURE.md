# RetroBoard AI - Infrastructure & Deployment Guide

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Initial Setup (New Project)](#initial-setup-new-project)
- [OAuth Setup (Google Sign-In)](#oauth-setup-google-sign-in)
- [Custom Domains](#custom-domains)
- [CI/CD Pipeline](#cicd-pipeline)
- [Local Development](#local-development)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Firebase Hosting                      │
│   reaitro.com / airetrotool.com / *.web.app              │
│                                                          │
│   Vue 3 + Vite (Static SPA)                             │
│   /api/** → rewrites to Cloud Run                       │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS (same domain, no CORS)
┌────────────────────────▼────────────────────────────────┐
│                    Cloud Run                             │
│   FastAPI Backend (retroboard-service)                  │
│   • REST API (/api/v1/*)                                │
│   • Google Sign-In token verification                   │
│   • Vertex AI (Gemini 1.5 Flash) for AI features        │
│   • Firestore for data persistence                      │
└────────────────────────┬────────────────────────────────┘
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
┌───▼───┐          ┌─────▼─────┐       ┌──────▼──────┐
│Firestore│         │ Vertex AI │       │Secret Manager│
│(retroboard│       │(Gemini 1.5│       │(OAuth creds, │
│-db-ew4)  │       │  Flash)   │       │ app secrets) │
└──────────┘       └───────────┘       └──────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| Firebase Hosting rewrites `/api/**` to Cloud Run | Same-domain requests = no CORS, no extra config |
| No Firebase SDK in frontend | Lighter bundle, all auth via backend JWT |
| Vertex AI (not OpenAI) | Native GCP integration, no external API keys |
| Terraform for infra | Reproducible, version-controlled infrastructure |
| Secret Manager for credentials | No secrets in code or env files |

---

## Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/install) (`gcloud`)
- [Terraform](https://www.terraform.io/downloads) ≥ 1.3
- [Node.js](https://nodejs.org/) ≥ 20
- [Python](https://www.python.org/) ≥ 3.10
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)
- A Google Cloud billing account

---

## Initial Setup (New Project)

### 1. Authenticate with Google Cloud

```bash
gcloud auth login
gcloud auth application-default login
```

### 2. Create the GCP Project

```bash
gcloud projects create YOUR_PROJECT_ID --name="RetroBoard AI"
```

### 3. Link a Billing Account

```bash
# List available billing accounts
gcloud billing accounts list

# Link to project (replace with your billing account ID)
gcloud billing projects link YOUR_PROJECT_ID \
  --billing-account=XXXXXX-XXXXXX-XXXXXX
```

### 4. Create the Terraform State Bucket

```bash
gcloud storage buckets create gs://YOUR_TF_STATE_BUCKET \
  --project=YOUR_PROJECT_ID \
  --location=europe-west4
```

### 5. Connect GitHub to Cloud Build

1. Go to [Cloud Build → Repositories](https://console.cloud.google.com/cloud-build/repositories?project=YOUR_PROJECT_ID)
2. Click **"Connect Repository"**
3. Select **GitHub** and authorize access
4. Select the `your-github-org/retroboard` repository
5. Click **Connect**

### 6. Enable Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Select `YOUR_PROJECT_ID` from the dropdown
4. Complete the setup wizard
5. Go to **Build → Hosting → Get Started** and click through the prompts

### 7. Apply Terraform

```bash
cd terraform

# Update terraform.tfvars with your values
cat terraform.tfvars
# project_id    = "YOUR_PROJECT_ID"
# region        = "europe-west4"
# github_org    = "your-github-org"
# support_email = "you@example.com"

terraform init
terraform apply
```

This creates:
- ✅ All required GCP APIs (Firestore, Vertex AI, Cloud Build, etc.)
- ✅ Firestore database (`retroboard-db-ew4`)
- ✅ Artifact Registry for Docker images
- ✅ Service Account with proper IAM roles
- ✅ Secret Manager secrets
- ✅ Cloud Run service
- ✅ Cloud Build trigger (watches `main` branch)

---

## OAuth Setup (Google Sign-In)

> **Why is this manual?** The Terraform `google_iap_client` resource creates
> locked IAP clients that don't support custom redirect URIs. Standard web
> OAuth clients must be created via the Google Cloud Console.

### Run the Setup Script

```bash
./scripts/setup-oauth.sh
```

The script will:
1. Check the OAuth consent screen
2. Prompt you to create a Web OAuth client in the Console
3. Ask you to paste the Client ID and Client Secret
4. Store both values in **Secret Manager** (`google-oauth-credentials`)
5. Update `frontend/src/assets/config.json` with the new Client ID

### Step 1: Configure OAuth Consent Screen

Before creating an OAuth client, Google requires a consent screen to be configured.

1. Go to [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent?project=YOUR_PROJECT_ID)
2. Select **External** user type → Click **CREATE**
3. Fill in the form:
   - **App name:** `RetroBoard AI`
   - **User support email:** `you@example.com`
   - **App logo:** *(optional, upload your logo)*
   - **App home page:** `https://reaitro.com`
   - **App privacy policy:** `https://reaitro.com/privacy` *(optional)*
   - **App terms of service:** `https://reaitro.com/terms` *(optional)*
   - **Authorized domains:** Add `reaitro.com` and `airetrotool.com`
   - **Developer contact email:** `you@example.com`
4. Click **SAVE AND CONTINUE**
5. **Scopes** → Click **ADD OR REMOVE SCOPES** → Select:
   - `openid`
   - `email`
   - `profile`
6. Click **SAVE AND CONTINUE**
7. **Test users** → Skip (not needed for external apps) → Click **SAVE AND CONTINUE**
8. Click **BACK TO DASHBOARD**

> **Publishing status:** The app starts in "Testing" mode (limited to 100 test users).
> Once you're ready for production, click **PUBLISH APP** on the consent screen dashboard
> to allow any Google user to sign in.

### Step 2: Create OAuth 2.0 Web Client

1. Go to [APIs & Credentials](https://console.cloud.google.com/apis/credentials?project=YOUR_PROJECT_ID)
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Application type: **Web application**
4. Name: `RetroBoard Web Client`
5. **Authorized JavaScript origins:**
   - `https://YOUR_PROJECT_ID.web.app`
   - `https://reaitro.com`
   - `https://airetrotool.com`
   - `http://localhost:5173`
6. **Authorized redirect URIs:**
   - `https://YOUR_PROJECT_ID.web.app/login?provider=google`
   - `https://reaitro.com/login?provider=google`
   - `https://airetrotool.com/login?provider=google`
   - `http://localhost:5173/login?provider=google`
7. Click **CREATE** and note the Client ID and Secret

### How Credentials Flow

```
Terraform creates Secret Manager secret "google-oauth-credentials"
         │
         ▼
setup-oauth.sh stores { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } as a version
         │
         ▼
Backend (config.py) reads from Secret Manager at startup
         │
         ▼
Frontend (config.json) has Client ID hardcoded for OAuth redirect
```

---

## Custom Domains

### Connecting Domains to Firebase Hosting

1. Go to [Firebase Console → Hosting](https://console.firebase.google.com/project/YOUR_PROJECT_ID/hosting)
2. Click **"Add custom domain"**
3. Add `reaitro.com` → Firebase provides DNS A records
4. Add `airetrotool.com` → Firebase provides DNS A records
5. Update your domain registrar with the provided DNS records
6. Wait for DNS verification (can take up to 24h)

> **Note:** `firebase.json` routing rules are domain-agnostic. The `/api/**` →
> Cloud Run rewrite works on ALL connected domains automatically.

### Domain Checklist

| Domain | Firebase Hosting | OAuth Redirect URI | OAuth JS Origin |
|---|---|---|---|
| `YOUR_PROJECT_ID.web.app` | ✅ Auto | ✅ Added | ✅ Added |
| `reaitro.com` | ⬜ Add manually | ✅ Added | ✅ Added |
| `airetrotool.com` | ⬜ Add manually | ✅ Added | ✅ Added |
| `localhost:5173` | N/A (dev) | ✅ Added | ✅ Added |

---

## CI/CD Pipeline

### Trigger

The pipeline triggers automatically on every push to the `main` branch.

### Pipeline Steps (`cloudbuild.yaml`)

| Step | Image | What it does |
|---|---|---|
| 1. Get Project Number | `cloud-sdk` | Reads GCP project number for env vars |
| 2. Build Frontend | `node:20` | `npm ci` + `npm run build:ignore-ts` |
| 3. Deploy Frontend | `node:20` | `firebase deploy --only hosting` |
| 4. Build Backend | `docker` | Builds the FastAPI Docker image |
| 5. Push Image | `docker` | Pushes to Artifact Registry |
| 6. Deploy Backend | `cloud-sdk` | `gcloud run deploy` to Cloud Run |

### Deploying

```bash
git add .
git commit -m "your changes"
git push origin main
```

Monitor builds at [Cloud Build Dashboard](https://console.cloud.google.com/cloud-build/builds?project=YOUR_PROJECT_ID).

---

## Local Development

### 1. Authenticate

```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Start the Backend

```bash
cd backend
cp .env.example .env          # then fill in your values
export CUSTOM_CONFIGURE_DEPLOYMENT=true   # use .env/env vars instead of Secret Manager

python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Environment Configuration

### Backend (`config.py`)

| Variable | Source (Production) | Source (Local) |
|---|---|---|
| `GOOGLE_CLOUD_PROJECT` | Cloud Run env var | `backend/.env` |
| `GOOGLE_CLIENT_ID` | Secret Manager (`google-oauth-credentials`) | `backend/.env` |
| `GOOGLE_CLIENT_SECRET` | Secret Manager (`google-oauth-credentials`) | `backend/.env` |
| `SECRET_KEY` | Secret Manager (`app-secrets`) | `backend/.env` |
| `AI_PROVIDER` | Cloud Run env var (defaults to `vertex`) | `backend/.env` |
| `CUSTOM_CONFIGURE_DEPLOYMENT` | Not set (defaults to `false` → uses Secret Manager) | Set to `true` → uses env vars |

### Frontend (`config.json`)

| Key | Value |
|---|---|
| `google.clientId` | `YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com` |
| `google.redirectUri` | `/login?provider=google` |
| `microsoft.enabled` | `false` |

### Terraform Variables (`terraform.tfvars`)

| Variable | Value |
|---|---|
| `project_id` | `YOUR_PROJECT_ID` |
| `region` | `europe-west4` |
| `github_org` | `your-github-org` |
| `support_email` | `you@example.com` |

---

## Troubleshooting

### Build fails: "resolving hosting target of a site with no site name"
Firebase hasn't been initialized on the GCP project. Go to Firebase Console and add the project.

### `terraform apply` fails: "Database already exists"
Firestore databases can't be renamed. Change the `name` in `main.tf` to something unique.

### `terraform apply` fails: "Repository mapping does not exist"
GitHub hasn't been connected to Cloud Build for this project. Follow [Step 5](#5-connect-github-to-cloud-build).

### OAuth redirect fails: "redirect_uri_mismatch"
The redirect URI in the browser doesn't match what's configured in the OAuth client. Go to [APIs & Credentials](https://console.cloud.google.com/apis/credentials?project=YOUR_PROJECT_ID) and add the missing URI.

### Backend returns 500 on AI endpoints
Vertex AI needs Application Default Credentials. Ensure `gcloud auth application-default login` has been run (locally) or the service account has `roles/aiplatform.user` (in production).

### Local backend can't connect to Firestore
Ensure you've run `gcloud auth application-default login` and `CUSTOM_CONFIGURE_DEPLOYMENT=true` is set.
