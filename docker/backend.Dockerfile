FROM node:20-alpine
WORKDIR /app

# Install OpenSSL and other dependencies
RUN apk add --no-cache python3 make g++ openssl openssl-dev

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install dependencies
RUN npm install --legacy-peer-deps || npm install --force

WORKDIR /app/apps/backend
RUN npm install --legacy-peer-deps || npm install --force

# Copy application code
WORKDIR /app
COPY apps/backend ./apps/backend
COPY packages ./packages
COPY tsconfig.json ./

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN npx prisma generate || echo "Prisma schema not found"

EXPOSE 3001
CMD ["npm", "run", "start:dev"]
