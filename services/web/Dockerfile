# Dockerfile corrigido — para services/web
# 1) Base image Node.js
FROM node:20-alpine

WORKDIR /usr/src/app

# 2) Copia package.json + instala
COPY ./app/package*.json ./
RUN npm install

# 3) Copia o restante
COPY ./app ./

# 4) Build Next.js
RUN npm run build

# 5) Porta e variável
ENV PORT 3000
EXPOSE ${PORT}

# 6) Start em modo produção, respeitando $PORT
CMD ["sh", "-c", "npm run dev -- -p ${PORT}"]

# Inicia o servidor em modo produção
# RUN npm run build
# CMD ["npm", "run", "start"]