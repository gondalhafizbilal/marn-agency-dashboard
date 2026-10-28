# Build Stage
# ===========
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies (cached independently of the source tree)
COPY package.json .
COPY package-lock.json .
RUN npm ci

# Copy source code
COPY . .

# NEXT_PUBLIC_* values are inlined into the client bundle by the compiler at
# BUILD time, so they must be present here — passing them as ECS task
# environment variables or secrets has no effect on the shipped bundle.
# CI supplies these from var.dashboard_app_config in marn-infra.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Start Execution
# ===============
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# `output: "standalone"` produces a server bundle that already contains the
# node_modules it needs, so there is no npm install in this stage.
# public/ and .next/static are not included in the standalone output and must
# be copied separately.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

EXPOSE 3000

# 3000 matches dashboard_service.port in marn-infra.
ENV PORT=3000

# The standalone server binds to localhost by default, which would make the ALB
# health check fail — it must listen on all interfaces inside the task.
ENV HOSTNAME=0.0.0.0

USER node

CMD ["node", "server.js"]
