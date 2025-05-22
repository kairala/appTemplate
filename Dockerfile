ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS alpine
ARG PNPM_VERSION_ARG=10.7.0

ENV PNPM_VERSION=${PNPM_VERSION_ARG}
RUN apk update
RUN npm install -g pnpm@${PNPM_VERSION}


FROM alpine AS builder

ARG SENTRY_AUTH_TOKEN_ARG

ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN_ARG}

RUN corepack enable
RUN npm install turbo --global
RUN pnpm config set store-dir ~/.pnpm-store

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm build
RUN pnpm sentry:sourcemaps


FROM builder AS dependencies

WORKDIR /app

RUN pnpm prune --prod


FROM alpine AS backend

RUN apk add --update \
  curl \
  && rm -rf /var/cache/apk/*

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nest

WORKDIR /app

ENV NODE_ENV=production


COPY --from=builder --chown=nest:nodejs /app/package.json .
COPY --from=builder --chown=nest:nodejs /app/nest-cli.json .
COPY --from=builder --chown=nest:nodejs /app/dist ./dist
COPY --from=dependencies --chown=remix:nodejs /app/node_modules ./node_modules

CMD ["node", "./dist/main"]
