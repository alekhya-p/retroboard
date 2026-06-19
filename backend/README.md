# RetroBoard Backend

A FastAPI-based backend for the RetroBoard application.

> 🔗 Live app: **[reaitro.com](https://reaitro.com)**

## Features

- FastAPI for high-performance API
- Firestore integration for data persistence
- Google Cloud Secret Manager for secure secret management
- Cloud Run deployment
- Workload Identity Federation for secure authentication

## Prerequisites

- Python 3.11+
- Google Cloud SDK
- Docker

## Environment Variables

The following environment variables are required:

- `GOOGLE_CLOUD_PROJECT`: Google Cloud project ID
- `SECRET_KEY`: Application secret key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `VERTEX_AI_LOCATION`: Vertex AI region for Gemini (e.g. `europe-west4`)

> AI features run on **Google Vertex AI (Gemini)** via Application Default
> Credentials - no OpenAI key is required on this branch.

## Development Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your values
```

3. Run the development server:
```bash
uvicorn app.main:app --reload
```

## Deployment

The application is deployed using Google Cloud Build and Cloud Run. See the main README for deployment instructions. 