terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  backend "gcs" {
    bucket = "YOUR_TF_STATE_BUCKET"
    prefix = "terraform/state"
  }

  required_version = ">= 1.3"
}

variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
}

variable "github_org" {
  description = "The GitHub organization name"
  type        = string
}

variable "support_email" {
  description = "Support email for OAuth consent screen"
  type        = string
}

variable "api_subdomain" {
  description = "Custom subdomain mapped directly to Cloud Run for API + WebSocket traffic (bypasses Firebase Hosting, which does not proxy WebSocket upgrades)"
  type        = string
  default     = "api.reaitro.com"
}

# Get project details (for project number)
data "google_project" "project" {
  project_id = var.project_id
}

# Enable required APIs
resource "google_project_service" "apis" {
  project = var.project_id
  for_each = toset([
    "firestore.googleapis.com",
    "aiplatform.googleapis.com",
    "firebase.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "iap.googleapis.com"
  ])
  service             = each.key
  disable_on_destroy  = false
}

# Create Firestore database
resource "google_firestore_database" "retroboard_db" {
  project     = var.project_id
  name        = "retroboard-db-ew4"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.apis]
}

# Artifact Registry for container images
resource "google_artifact_registry_repository" "retroboard" {
  project       = var.project_id
  location      = var.region
  repository_id = "retroboard"
  description   = "Docker repository for RetroBoard"
  format        = "DOCKER"
}

# Deployment service account
resource "google_service_account" "retroboard_deployer" {
  project      = var.project_id
  account_id   = "retroboardsa"
  display_name = "RetroBoard Service Account"
}

# IAM role bindings (grouped)
resource "google_project_iam_member" "retroboard_roles" {
  for_each = {
    secret_manager       = "roles/secretmanager.secretAccessor"
    cloud_run_admin      = "roles/run.admin"
    artifact_registry    = "roles/artifactregistry.writer"
    firestore_user       = "roles/datastore.user"
    logging              = "roles/logging.logWriter"
    service_account_user = "roles/iam.serviceAccountUser"
    firebase_hosting     = "roles/firebasehosting.admin"
    vertex_ai_user       = "roles/aiplatform.user"
  }

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.retroboard_deployer.email}"
}

# Secret Manager
resource "google_secret_manager_secret" "app_secrets" {
  project   = var.project_id
  secret_id = "app-secrets"

  replication {
    auto {}
  }
}

# JWT signing key - generated once, persisted in Terraform state. Rotate by tainting this resource.
resource "random_password" "jwt_secret_key" {
  length  = 64
  special = false
}

resource "google_secret_manager_secret_version" "app_secrets" {
  secret      = google_secret_manager_secret.app_secrets.id
  secret_data = jsonencode({
    SECRET_KEY = random_password.jwt_secret_key.result
  })
}

# Cloud Run service with health checks
resource "google_cloud_run_v2_service" "retroboard" {
  project     = var.project_id
  name        = "retroboard-service"
  location    = var.region
  description = "Online free AI retrotool"
  ingress     = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "gcr.io/cloudrun/hello"

      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project_id
      }
    }

    service_account    = google_service_account.retroboard_deployer.email
    session_affinity   = true
  }
}

# Allow unauthenticated invocation so Firebase Hosting `/api/**` rewrite can proxy to Cloud Run
resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  project  = var.project_id
  location = google_cloud_run_v2_service.retroboard.location
  name     = google_cloud_run_v2_service.retroboard.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Custom domain mapping for direct Cloud Run access (WebSocket-capable, unlike Firebase Hosting rewrites).
# Domain ownership must be verified for the GCP project before this resource can be created;
# see https://cloud.google.com/run/docs/mapping-custom-domains#adding_verified_domain_owners
resource "google_cloud_run_domain_mapping" "api" {
  project  = var.project_id
  location = var.region
  name     = var.api_subdomain

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.retroboard.name
  }
}

output "api_subdomain_dns_records" {
  description = "DNS records to add at your DNS provider for the API subdomain (typically CNAME -> ghs.googlehosted.com)"
  value       = google_cloud_run_domain_mapping.api.status[0].resource_records
}

# Cloud Build Trigger for GitHub 'main' branch
resource "google_cloudbuild_trigger" "main_branch_trigger" {
  project     = var.project_id
  name        = "retroboard-deploy-trigger"
  description = "Trigger to deploy retroboard from the main branch"
  location    = var.region

  repository_event_config {
    repository = "projects/${var.project_id}/locations/${var.region}/connections/Github/repositories/${var.github_org}-retroboard"
    push {
      branch = "^main$"
    }
  }

  filename = "cloudbuild.yaml"
  
  service_account = google_service_account.retroboard_deployer.id
}

# ─────────────────────────────────────────────────
# OAuth 2.0 Client (Google Sign-In)
# Created via setup script - see scripts/setup-oauth.sh
# ─────────────────────────────────────────────────

# Secret Manager for OAuth credentials (populated by setup script)
resource "google_secret_manager_secret" "google_oauth" {
  project   = var.project_id
  secret_id = "google-oauth-credentials"

  replication {
    auto {}
  }

  depends_on = [google_project_service.apis]
}

# ─────────────────────────────────────────────────
# Outputs
# ─────────────────────────────────────────────────

output "cloud_run_url" {
  description = "Cloud Run service URL"
  value       = google_cloud_run_v2_service.retroboard.uri
}

output "firebase_hosting_url" {
  description = "Firebase Hosting URL"
  value       = "https://${var.project_id}.web.app"
}

output "project_number" {
  description = "GCP Project Number"
  value       = data.google_project.project.number
}
