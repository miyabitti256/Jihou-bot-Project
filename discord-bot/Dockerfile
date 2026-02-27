FROM oven/bun:1.3.9
WORKDIR /app

COPY package.json ./
RUN bun install --production

COPY prisma ./prisma
COPY prisma.config.ts ./
# Prisma v7 config evaluation at build time requires some URL to be present, even for 'generate'.
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" bunx prisma generate

COPY . .

CMD ["bun", "run", "start"]