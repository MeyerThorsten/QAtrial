# Stage 1: Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build server
FROM node:20-alpine AS server
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server/ ./server/
COPY --from=frontend /app/dist ./dist/

# Stage 3: Runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=server /app ./
EXPOSE 3001
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://qatrial:qatrial@db:5432/qatrial
CMD ["npx", "tsx", "server/index.ts"]
