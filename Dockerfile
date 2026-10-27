FROM node:22-slim AS dependencies

WORKDIR /app
ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-slim

ENV NODE_ENV=production
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

RUN useradd --system --uid 1001 betalife && chown -R betalife: /app
USER betalife

EXPOSE 4000
CMD ["node", "src/index.js"]
