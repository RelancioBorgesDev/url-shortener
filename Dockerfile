# Stage base
FROM node:lts-alpine AS base
WORKDIR /app

# Stage de dependências
FROM base AS deps
COPY package*.json ./
RUN npm install --omit=dev

# Stage runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3333

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api
USER api

COPY --from=deps /app/node_modules ./node_modules
COPY dist ./dist

COPY .env.docker .env

EXPOSE 3333

CMD ["node", "dist/server.js"]
