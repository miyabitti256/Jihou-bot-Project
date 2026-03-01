FROM oven/bun:latest
WORKDIR /app

# packages/database のPrisma関連ファイルをコピー
COPY packages/database/package.json ./packages/database/package.json
COPY packages/database/prisma ./packages/database/prisma
COPY packages/database/prisma.config.ts ./packages/database/prisma.config.ts
COPY packages/database/src ./packages/database/src

# discord-bot のpackage.jsonをコピー
COPY discord-bot/package.json ./discord-bot/package.json

# ルートpackage.jsonとbun.lockをコピー（ワークスペース解決用）
COPY package.json ./
COPY bun.lock ./

# 依存関係をインストール
RUN cd discord-bot && bun install --production

# Prisma Client生成
# Prisma v7 config evaluation at build time requires some URL to be present, even for 'generate'.
RUN cd packages/database && DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" bunx prisma generate

# ソースコードをコピー
COPY discord-bot ./discord-bot

# --smol: Bun(JavaScriptCore)のヒープを小さく保ちGCを頻繁に実行する
# 512MBメモリ環境でのOOM防止に不可欠
CMD ["bun", "--smol", "run", "discord-bot/src/start.ts"]