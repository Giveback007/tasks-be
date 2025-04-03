ARG NODE_VERSION=22.8.0
ARG PNPM_VERSION=10.6.1

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm@${PNPM_VERSION}
RUN pnpm install

COPY . .
RUN pnpm build

EXPOSE 8080

CMD ["node", "dist/main.js"]