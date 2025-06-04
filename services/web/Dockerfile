# services/web/Dockerfile

# 1. Imagem base Node.js (alpine)
FROM node:20-alpine

# 2. Define diretório de trabalho dentro do container
WORKDIR /usr/src/app

# 3. Copia package.json e package-lock.json para instalar dependências
COPY ./app/package*.json ./

# 4. Instala dependências do Next.js
RUN npm install

# 5. Copia todo o restante do código do Next.js
COPY ./app /usr/src/app

# 6. Expõe a porta usada pelo Next.js
EXPOSE 3000

# 7. Comando padrão para rodar o Next.js em modo de desenvolvimento
CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "start"]
