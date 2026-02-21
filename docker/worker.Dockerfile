FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY apps/worker/package*.json ./apps/worker/

# Install dependencies
RUN npm install --legacy-peer-deps || npm install --force

WORKDIR /app/apps/worker
RUN npm install --legacy-peer-deps || npm install --force

# Copy application code
WORKDIR /app
COPY apps/worker ./apps/worker
COPY apps/backend/prisma ./apps/backend/prisma
COPY packages ./packages
COPY tsconfig.json ./

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN npx prisma generate || echo "Prisma schema not found"

WORKDIR /app/apps/worker
CMD ["npm", "run", "dev"]
