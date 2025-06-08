#!/bin/bash

echo "===== Docker Cleanup Script ====="
echo "Este script irá limpar imagens não utilizadas, containers parados, volumes órfãos e cache de build."
echo ""

read -p "Deseja remover containers parados? [s/N]: " rm_containers
if [[ "$rm_containers" == "s" || "$rm_containers" == "S" ]]; then
    docker container prune -f
fi

read -p "Deseja remover volumes não utilizados? [s/N]: " rm_volumes
if [[ "$rm_volumes" == "s" || "$rm_volumes" == "S" ]]; then
    docker volume prune -f
fi

read -p "Deseja remover imagens não utilizadas? (ex: builds antigos) [s/N]: " rm_images
if [[ "$rm_images" == "s" || "$rm_images" == "S" ]]; then
    docker image prune -a -f
fi

echo ""
echo "→ Limpando cache de builder (buildkit)..."
docker builder prune -af

echo ""
echo "✅ Limpeza concluída!"
