#!/bin/bash
set -e
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
TF_DIR="$SCRIPT_DIR/../infrastructure/terraform"

RESOURCE_GROUP=${RESOURCE_GROUP:-my-cantina-rg}
LOCATION=${LOCATION:-westeurope}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-"<ADMIN_PASSWORD>"}

cd "$TF_DIR"
terraform init -input=false
terraform apply -auto-approve \
  -var "resource_group_name=$RESOURCE_GROUP" \
  -var "location=$LOCATION" \
  -var "admin_password=$ADMIN_PASSWORD"

