#!/bin/bash

# Variables
RESOURCE_GROUP="retroboard"
LOCATION="francecentral"
STORAGE_ACCOUNT_NAME="retroboardsa"
DEPLOYMENT_NAME="StorageAccountDeployment"
INDEX_DOCUMENT="index.html"
ERROR_DOCUMENT="index.html"

# Create a resource group (if it doesn't exist)
echo "Creating resource group if it doesn't exist..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create a storage account
echo "Creating storage account..."
az storage account create \
  --name $STORAGE_ACCOUNT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2 \
  --enable-hierarchical-namespace false \
  --allow-blob-public-access true \
  --min-tls-version TLS1_2

# Get the storage account key
echo "Getting storage account key..."
STORAGE_ACCOUNT_KEY=$(az storage account keys list --resource-group $RESOURCE_GROUP --account-name $STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv)

# Create a container for static website hosting
echo "Creating container for static website hosting..."
az storage container create \
  --name "\$web" \
  --account-name $STORAGE_ACCOUNT_NAME \
  --account-key $STORAGE_ACCOUNT_KEY \
  --public-access blob

# Enable static website hosting
echo "Enabling static website hosting..."
az storage blob service-properties update \
  --account-name $STORAGE_ACCOUNT_NAME \
  --account-key $STORAGE_ACCOUNT_KEY \
  --static-website \
  --index-document $INDEX_DOCUMENT \
  --404-document $ERROR_DOCUMENT

# Get the static website URL
STATIC_WEBSITE_URL="https://${STORAGE_ACCOUNT_NAME}.z6.web.core.windows.net/"

echo "Deployment completed successfully!"
echo "Static website URL: $STATIC_WEBSITE_URL"
echo "To upload files to your static website, use the following command:"
echo "az storage blob upload-batch -s <local-folder> -d \$web --account-name $STORAGE_ACCOUNT_NAME --account-key $STORAGE_ACCOUNT_KEY"
