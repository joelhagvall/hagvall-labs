FROM oven/bun:1.3.14-slim@sha256:d56a2534ffd262e92c12fd3249d3924d296d97086da773f821d7d0477435ea04 AS base

FROM base AS build
ARG VITE_UMAMI_ENABLED=true
WORKDIR /app

# Public build flag only. Umami credentials stay in the runtime .env file.
ENV VITE_UMAMI_ENABLED=${VITE_UMAMI_ENABLED}

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun x tsc --noEmit
RUN bun run build

FROM base AS production-dependencies
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Keep shells and package-manager utilities out of the runtime image. Bun and
# its required runtime libraries are copied in from the pinned build image.
FROM gcr.io/distroless/cc-debian13:nonroot@sha256:d97bc0a941b8d4be647dc0ee75b264ddbb772f1ac5ba690a4309c00723b23775
WORKDIR /app
COPY --from=production-dependencies --chown=65532:65532 /usr/local/bin/bun /usr/local/bin/bun
COPY --from=production-dependencies --chown=65532:65532 /app/node_modules ./node_modules
COPY --from=build --chown=65532:65532 /app/dist ./dist
COPY --from=build --chown=65532:65532 /app/scripts/serve-prod.ts ./scripts/serve-prod.ts

ENV NODE_ENV=production
USER 65532:65532
EXPOSE 4173
CMD ["/usr/local/bin/bun", "scripts/serve-prod.ts"]
