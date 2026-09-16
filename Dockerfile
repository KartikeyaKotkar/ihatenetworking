# Self-host image. Vercel build untouched: no standalone output,
# no source edits. Builds inside container with same npm scripts.
FROM node:22-bookworm-slim AS builder

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
# PostHog vars optional. Empty = analytics off, no crash in prod.
ARG NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=""
ARG NEXT_PUBLIC_POSTHOG_HOST=""
RUN npm run build

FROM node:22-bookworm-slim AS runner

# ping + traceroute/tracepath shells used by /api/ping, /api/traceroute.
# whois optional: lib uses TCP/43, binary only helps manual debug.
RUN apt-get update && apt-get install -y --no-install-recommends \
    iputils-ping traceroute whois ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

RUN useradd -m -u 1001 nextjs && chown -R nextjs:nextjs /app
USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["npm", "start"]
