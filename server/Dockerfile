# Dockerfile para o Backend Server SENTINELX (Node.js 22 LTS)
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas as dependências
RUN npm ci

# Copiar código-fonte do servidor
COPY . .

# Gerar Prisma Client e compilar TypeScript
RUN npx prisma generate
RUN npm run build

# Imagem de Execução Produção (Leve)
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000

CMD ["node", "dist/index.js"]
