FROM node:20 AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

###

FROM node:20-stretch-slim AS runner
ENV NODE_ENV=production

WORKDIR /app

# standaloneモードでは`public`と`.next/static`はデフォルトでは含まれないため明示的にコピーする
# https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/.next/standalone ./

CMD ["node", "server.js"]
