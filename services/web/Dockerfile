FROM node:20-alpine

WORKDIR /usr/src/app

# Copia os arquivos do projeto (incluindo src/app, etc.)
COPY ./app /usr/src/app

# Instala dependências
RUN npm install

# Expõe a porta usada pelo Next.js
EXPOSE 8000

# Inicia o servidor em desenvolvimento
# CMD ["npm", "run", "dev"]

# Inicia o servidor para produção
RUN npm run build
CMD ["npm", "run", "start"]