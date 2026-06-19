from google.cloud import secretmanager
import logging
import os
import json
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

def get_secret(secret_id: str, version: str = "latest") -> Dict[str, Any]:
    """
    Retrieve a specific secret from Google Cloud Secret Manager.
    
    Args:
        secret_id: The ID of the secret to retrieve
        version: The version of the secret to retrieve (default: "latest")
    
    Returns:
        Dictionary containing the secret values
    """
    try:
        # Get project ID from environment
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        if not project_id:
            logger.error("GOOGLE_CLOUD_PROJECT environment variable not set")
            return {}

        # Initialize the Secret Manager client
        client = secretmanager.SecretManagerServiceClient()
        
        # Get the specific secret
        name = f"projects/{project_id}/secrets/{secret_id}/versions/{version}"
        response = client.access_secret_version(request={"name": name})
        secret_value = response.payload.data.decode("UTF-8")
        
        # Try to parse as JSON
        try:
            return json.loads(secret_value)
        except json.JSONDecodeError:
            logger.error(f"Secret {secret_id} is not valid JSON")
            return {}
            
    except Exception as e:
        logger.error(f"Error retrieving secret {secret_id}: {str(e)}")
        return {}

def get_secrets_from_manager() -> Dict[str, Any]:
    """
    Retrieve secrets from Google Cloud Secret Manager.
    Returns an empty dict if secrets cannot be retrieved.
    """
    try:
        # Get project ID from environment or use default
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        if not project_id:
            logger.error("GOOGLE_CLOUD_PROJECT environment variable not set")
            return {}

        # Initialize the Secret Manager client
        client = secretmanager.SecretManagerServiceClient()
        
        # Get the project path
        project_path = f"projects/{project_id}"
        
        # List all secrets in the project
        secrets = {}
        for secret in client.list_secrets(request={"parent": project_path}):
            try:
                # Get the latest version of the secret
                name = f"{secret.name}/versions/latest"
                response = client.access_secret_version(request={"name": name})
                secrets[secret.name.split("/")[-1]] = response.payload.data.decode("UTF-8")
                logger.info(f"Successfully retrieved secret: {secret.name.split('/')[-1]}")
            except Exception as e:
                logger.error(f"Error retrieving secret {secret.name}: {str(e)}")
                continue
                
        return secrets
        
    except Exception as e:
        logger.error(f"Error accessing Secret Manager: {str(e)}")
        return {} 