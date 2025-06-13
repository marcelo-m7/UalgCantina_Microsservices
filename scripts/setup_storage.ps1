param(
  [string]$ResourceGroup,
  [string]$StorageName
)

az storage account create \
  --name $StorageName \
  --resource-group $ResourceGroup \
  --sku Standard_LRS
