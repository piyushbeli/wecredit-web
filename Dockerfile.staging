FROM public.ecr.aws/docker/library/node:20-alpine AS base

# ---- Dependencies ----
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --ignore-scripts; \
  else npm install --ignore-scripts; \
  fi

# ---- Build ----
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_ENVIRONMENT=staging
ARG NEXT_PUBLIC_ENABLE_DEV_TOOLS=false
ARG NEXT_PUBLIC_API_URL=https://api.wecredit.co.in
ARG NEXT_PUBLIC_STRAPI_URL=https://blogs.wecredit.co.in
ARG NEXT_PUBLIC_WEBSITE_BASE_URL=https://staging.wecredit.co.in
ARG STRAPI_API_TOKEN=de75037bd48ed00a0c7cbab75a3b54da530052e0c3206c911808f0a0786dbc210c5c32dec9fd576a1756f602f4f7e3c23a67480021854bde31421d99c82ddea6bd0d778983a2facf3002ce86905450bf0e0729bb86fbf0bbfe35ee6c31d7f6e07afd362326d649ce0afc76715925dc9009c3b823dee45abbd3a5ea3aa6ab9d15

ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_ENABLE_DEV_TOOLS=$NEXT_PUBLIC_ENABLE_DEV_TOOLS
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_WEBSITE_BASE_URL=$NEXT_PUBLIC_WEBSITE_BASE_URL
ENV STRAPI_API_TOKEN=$STRAPI_API_TOKEN
ENV NEXT_TELEMETRY_DISABLED=1

RUN rm -rf .next && npm run build

# ---- Runner ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
