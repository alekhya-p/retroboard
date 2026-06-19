#!/bin/bash

# Variables
RESOURCE_GROUP_NAME="retroboard"
LOCATION="francecentral"
APP_LOCATION="westeurope"
APP_NAME="retroboard-app"
PLAN_NAME="retroboard-plan"
DOCKER_IMAGE_NAME="retroboard-app"
DOCKER_REGISTRY="retroboardregistry"

# Login to Azure (if not already logged in)
echo "Logging into Azure..."
#az login

# Register required resource providers
echo "Registering required resource providers..."
az provider register --namespace Microsoft.Web

# Wait for registration to complete
echo "Waiting for resource provider registration to complete..."
az provider wait --namespace Microsoft.Web --created


# Create Resource Group if it doesn't exist
echo "Creating Resource Group..."
az group create --name $RESOURCE_GROUP_NAME --location $LOCATION

# Create Container Registry
echo "Creating Container Registry..."
az acr create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $DOCKER_REGISTRY \
    --sku Basic \
    --admin-enabled true

# Get the registry credentials
echo "Getting registry credentials..."
REGISTRY_LOGIN_SERVER=$(az acr show --name $DOCKER_REGISTRY --query loginServer --output tsv)
REGISTRY_USERNAME=$(az acr credential show --name $DOCKER_REGISTRY --query username --output tsv)
REGISTRY_PASSWORD=$(az acr credential show --name $DOCKER_REGISTRY --query "passwords[0].value" --output tsv)

# Login to the registry (using secure password input)
echo "Logging into Container Registry..."
echo "$REGISTRY_PASSWORD" | docker login $REGISTRY_LOGIN_SERVER -u $REGISTRY_USERNAME --password-stdin

# Build and tag the Docker image
echo "Building Docker image..."
docker build -t $DOCKER_IMAGE_NAME .

# # Tag and push the image
echo "Pushing Docker image..."
docker tag $DOCKER_IMAGE_NAME $REGISTRY_LOGIN_SERVER/$DOCKER_IMAGE_NAME:latest
docker push $REGISTRY_LOGIN_SERVER/$DOCKER_IMAGE_NAME:latest

# Create App Service Plan (Free tier - F1)
echo "Creating App Service Plan..."
az appservice plan create \
    --name $PLAN_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --location $APP_LOCATION \
    --sku F1 \
    --is-linux

Create Web App for Containers
echo "Creating Web App for Containers..."
az webapp create \
    --resource-group $RESOURCE_GROUP_NAME \
    --plan $PLAN_NAME \
    --name $APP_NAME \
    --deployment-container-image-name $REGISTRY_LOGIN_SERVER/$DOCKER_IMAGE_NAME:latest

# Configure the Web App to use the Container Registry
echo "Configuring Web App..."
az webapp config container set \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $APP_NAME \
    --docker-custom-image-name $REGISTRY_LOGIN_SERVER/$DOCKER_IMAGE_NAME:latest \
    --docker-registry-server-url https://$REGISTRY_LOGIN_SERVER \
    --docker-registry-server-user $REGISTRY_USERNAME \
    --docker-registry-server-password $REGISTRY_PASSWORD

echo -e "\nDeployment complete! Your app is available at:"
echo "https://${APP_NAME}.azurewebsites.net"
echo -e "\nNote: The free tier (F1) has the following limitations:"
echo "- 1GB RAM"
echo "- Shared CPU"
echo "- 1GB storage"
echo "- No custom domains"
echo "- No SSL"
echo "- No staging slots" 