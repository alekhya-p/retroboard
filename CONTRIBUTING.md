# Contributing to reAItro

Thanks for your interest in contributing! This project is open source under the
[Apache 2.0 License](LICENSE), and contributions of all kinds are welcome -
bug reports, features, docs, and feedback.

## Getting started

1. Fork the repository and clone your fork.
2. Follow the [README](README.md#quick-start-local-development) to run the
   backend and frontend locally.
3. Create a branch for your change: `git checkout -b my-feature`.

## Branches

- **`main`** - the default branch and the live Google Cloud deployment
  (Firestore + Vertex AI), running at [reaitro.com](https://reaitro.com).

Open your pull request against `main`. Azure deployment configs
(`azure-pipelines.yml`, `backend/infra/`, `frontend/infra/`) also live on
`main` for teams who self-host on Azure.

## Development guidelines

- **Frontend** - Vue 3 + TypeScript. Match the existing component and store
  patterns. Run `npm run build` to type-check before opening a PR.
- **Backend** - FastAPI + Pydantic. Keep models in `backend/app/models/`,
  business logic in `services/`, and HTTP routing in `routers/`.
- **Tests** - backend tests live in `backend/tests/` and run with `pytest`.
  Please add or update tests for behavior changes.

## Secrets & configuration

Never commit real credentials. Configuration is driven by environment
variables and Secret Manager - see `backend/.env.example` and
[INFRASTRUCTURE.md](INFRASTRUCTURE.md). Placeholders such as
`YOUR_GCP_PROJECT_ID` and `YOUR_GOOGLE_OAUTH_CLIENT_ID` mark values you must
supply for your own deployment.

## Submitting a pull request

1. Make sure the app builds and tests pass.
2. Write a clear description of what changed and why.
3. Open the PR against the appropriate branch.

By contributing, you agree that your contributions are licensed under the
Apache License 2.0.
