// Bicep exemplo para criar recurso de Storage e Function App
param resourceGroupName string
param location string = resourceGroup().location

resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: '${resourceGroupName}storage'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource functionApp 'Microsoft.Web/sites@2022-09-01' = {
  name: '${resourceGroupName}-func'
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: '' // Definir App Service Plan
  }
}
