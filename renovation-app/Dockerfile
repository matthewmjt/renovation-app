# ── Stage 1: build the React frontend ───────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app/client

# Copy client package files and install deps
COPY client/package.json ./
RUN npm install

# Copy client source and build
COPY client/ ./
RUN npm run build


# ── Stage 2: production server ───────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install server deps
COPY package.json ./
RUN npm install

# Copy server source
COPY server ./server

# Copy built frontend from stage 1
COPY --from=builder /app/dist ./dist

VOLUME ["/app/data"]

ENV NODE_ENV=production
ENV PORT=3001
ENV DATA_DIR=/app/data

EXPOSE 3001

CMD ["node", "server/index.js"]
