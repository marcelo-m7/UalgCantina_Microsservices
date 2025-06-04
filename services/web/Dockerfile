# Dockerfile corrigido — para services/web
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia os arquivos do projeto (incluindo src/app, etc.)
COPY ./app /usr/src/app

# Instala dependências
RUN npm install

# Compila o frontend
RUN npm run build

# Expõe a porta usada pelo Next.js
EXPOSE 3000

# Inicia o servidor em produção
CMD ["npm", "run", "dev"]

# CMD ["npm", "run", "start"]