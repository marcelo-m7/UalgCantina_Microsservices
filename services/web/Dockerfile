# services/web/Dockerfile

FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# 1) copie somente package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# 2) instale dependências
RUN npm install

# 3) copie o resto do código
COPY . .

# 4) construa o Next.js
RUN npm run build

# -------------------------------------------------------

# imagem final para rodar em produção
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# copie apenas o build + node_modules do builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public

EXPOSE 8000
CMD ["npm", "run", "start"]

# Inicia o servidor com compilação prévia
# CMD ["npm", "run", "dev"]
