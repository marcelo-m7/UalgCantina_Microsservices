#!/bin/bash
# Exemplo de deploy da WebApp para Azure Storage Static Website
az storage blob upload-batch \
  --account-name "$STORAGE_ACCOUNT" \
  -s ../webapp/dist \
  -d \$web
