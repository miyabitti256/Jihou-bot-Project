FROM oven/bun:latest
WORKDIR /app

# ルートpackage.json（ワークスペース定義）をコピー
COPY package.json ./

# packages/database のソースをコピー
COPY packages/database/package.json ./packages/database/package.json
COPY packages/database/src ./packages/database/src

# shared-types のpackage.jsonをコピー（ワークスペース解決用）
COPY packages/shared-types/package.json ./packages/shared-types/package.json

# front-app はワークスペース解決のみ必要（依存は不要）
RUN mkdir -p front-app && echo '{"name":"front-app","private":true}' > front-app/package.json

# discord-bot のpackage.jsonをコピー
COPY discord-bot/package.json ./discord-bot/package.json

# 依存関係をインストール
# Drizzle ORMはコード生成不要（Prismaと異なりバイナリエンジンなし）
RUN bun install --production --ignore-scripts

# ソースコードをコピー
COPY discord-bot ./discord-bot

# ランタイムのカレントディレクトリをdiscord-botに設定
# （コード内の相対パス ./src/commands 等を正しく解決するため）
WORKDIR /app/discord-bot

# --smol: Bun(JavaScriptCore)のヒープを小さく保ちGCを頻繁に実行する
# 512MBメモリ環境でのOOM防止に不可欠
CMD ["bun", "--smol", "run", "src/start.ts"]
