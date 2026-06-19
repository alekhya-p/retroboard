#!/bin/bash

# Azure Cosmos DB for MongoDB vCore Setup Script
# This script creates a free tier Cosmos DB for MongoDB vCore instance in West Europe

# Variables
RESOURCE_GROUP_NAME="retroboard"
LOCATION="francecentral"
ACCOUNT_NAME="retroboard-ca"
ADMIN_USERNAME="retroboardadmin"
ADMIN_PASSWORD="djhasdyiweuemnn79797adkjadsjjflasj"
SERVER_NAME="retroboard-mongodb"

# Install Python distutils if not present
echo "Installing Python distutils..."
python3 -m pip install setuptools

# Login to Azure (if not already logged in)
echo "Logging into Azure..."
#az login

# Install required Azure CLI extension
echo "Installing required Azure CLI extension..."
az extension add --name cosmosdb-preview

# Create Resource Group if it doesn't exist
echo "Creating Resource Group..."
az group create --name $RESOURCE_GROUP_NAME --location $LOCATION

# Create Cosmos DB for MongoDB vCore
echo "Creating Cosmos DB for MongoDB vCore..."
az cosmosdb create \
    --name $ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --locations regionName=$LOCATION \
    --kind MongoDB \
    --default-consistency-level Eventual \
    --enable-automatic-failover false \
    --capabilities EnableMongo \
    --ip-range-filter "0.0.0.0" \
    --enable-mongo-version-7.0 true

# Get the connection string
echo "Getting connection string..."
CONNECTION_STRING=$(az cosmosdb keys list \
    --name $ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --type connection-strings \
    --query "connectionStrings[0].connectionString" \
    --output tsv)

echo -e "\nConnection String:"
echo $CONNECTION_STRING

echo -e "\nSetup complete! Please save the connection string securely."
echo "Note: The connection string contains sensitive information. Do not share it publicly." 