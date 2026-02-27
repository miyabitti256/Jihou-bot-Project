FROM oven/bun:1.3.9
WORKDIR /app

COPY package.json ./
RUN bun install --production

COPY prisma ./prisma
COPY prisma.config.ts ./
# Prisma v7 config evaluation at build time requires some URL to be present, even for 'generate'.
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" bunx prisma generate

COPY . .

# --smol: Bun(JavaScriptCore)のヒープを小さく保ちGCを頻繁に実行する
# 512MBメモリ環境でのOOM防止に不可欠
CMD ["bun", "--smol", "run", "start"]