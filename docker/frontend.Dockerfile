FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/

# Install dependencies
RUN npm install --legacy-peer-deps || npm install --force

WORKDIR /app/apps/frontend
RUN npm install --legacy-peer-deps || npm install --force

# Copy application code
WORKDIR /app
COPY apps/frontend ./apps/frontend
COPY packages ./packages
COPY tsconfig.json ./

WORKDIR /app/apps/frontend
EXPOSE 3000
CMD ["npm", "run", "dev"]
