FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable \
    && corepack prepare pnpm@latest --activate

COPY . ./

RUN pnpm install --frozen-lockfile

EXPOSE 3000

CMD ["node", "src/server.ts"]