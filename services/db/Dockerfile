# project/db/Dockerfile
FROM mysql:8.0

# Copiar scripts de inicialização para a imagem
# O MySQL executa automaticamente qualquer .sql ou .sh em /docker-entrypoint-initdb.d
COPY init /docker-entrypoint-initdb.d

# (Nenhum CMD específico é necessário, a imagem oficial já define o entrypoint)