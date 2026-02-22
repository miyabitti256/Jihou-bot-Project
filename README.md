# 時報Bot プロジェクト

Discordサーバー向けの時報機能含む多機能Botとその管理Webフロントエンドのモノレポ。

## 構成

```
Jihou-bot-Project/
├── discord-bot/   # Discord Bot + REST API サーバー（Bun + Hono）
└── front-app/     # 管理用Webフロントエンド（Next.js）
```

---

## discord-bot

**ランタイム:** Bun  
**主な技術:**

| ライブラリ | 用途 |
|---|---|
| [discord.js](https://discord.js.org/) v14 | Discord Bot クライアント |
| [Hono](https://hono.dev/) v4 | REST API サーバー |
| [Prisma](https://www.prisma.io/) v7 + pg | ORM / PostgreSQL |
| [Zod](https://zod.dev/) | リクエストバリデーション |
| [node-cron](https://nodecron.com/) | スケジュール実行 |
| Google Gemini (`@google/genai`) | AI チャット機能 |
| Pino | ロギング |

### ディレクトリ構成

```
src/
├── api/
│   ├── routes/
│   │   ├── guilds/           # ギルド情報・スケジュールメッセージAPI
│   │   ├── users/            # ユーザー情報API
│   │   └── minigame/         # コインフリップ・おみくじAPI
│   └── schemas.ts            # 共通Zodスキーマ
├── commands/                 # スラッシュコマンド実装
│   ├── chat.ts               # AI チャット
│   ├── coinflip.ts           # コインフリップ
│   ├── omikuji.ts            # おみくじ
│   ├── janken.ts             # じゃんけん
│   └── {set,edit,delete,schedule-info}.ts  # 時報管理
├── handler/
│   ├── command.ts            # コマンドローダー
│   ├── discord-events.ts     # イベントハンドラ
│   └── ai-message.ts        # AIメッセージ処理
├── services/
│   ├── db-sync/guild-sync.ts # DBとDiscordの同期（毎時バッチ）
│   ├── discord/discord-api.ts# Discord REST API ラッパー
│   ├── guilds/               # ギルド・スケジュールメッセージサービス
│   ├── minigame/             # ミニゲーム（coinflip, omikuji, janken）
│   └── users/                # ユーザーサービス
├── lib/
│   ├── auth.ts               # APIキー認証ミドルウェア
│   ├── client.ts             # Discord.js クライアント（キャッシュ最適化済み）
│   ├── rate-limiter.ts       # レート制限
│   ├── prisma.ts             # Prismaクライアント
│   └── status-updater.ts     # ステータス更新・毎時ギルド同期スケジューラ
└── index.ts                  # エントリーポイント
```

### 主要機能

- **時報**: 指定チャンネルに毎日指定時刻にメッセージを送信
- **コインフリップ**: 所持金を賭けるミニゲーム
- **おみくじ**: 1日1回引けるおみくじ（AI解説オプション付き）
- **じゃんけん**: 他のユーザーと対戦できるミニゲーム
- **AIチャット**: Google Gemini を使った会話（スレッド履歴保持）

### 認証

フロントエンドとの通信は `X-API-Key` ヘッダーによるAPIキー認証。  
認証済みエンドポイントは `X-User-Id` ヘッダーでユーザーを識別。

### セットアップ

```bash
cd discord-bot
cp .env.example .env   # 環境変数を設定
bun install
bun run deploy         # スラッシュコマンドを登録
bun run dev            # 開発サーバー起動
```

### 環境変数

| 変数名 | 説明 |
|---|---|
| `DISCORD_TOKEN` | Botトークン |
| `DISCORD_CLIENT_ID` | アプリケーションID |
| `DATABASE_URL` | PostgreSQL 接続文字列 |
| `INTERNAL_API_KEY` | フロントエンドとの通信用APIキー |
| `GOOGLE_API_KEY` | Gemini APIキー |

---

## front-app

**フレームワーク:** Next.js 15 (App Router)  
**主な技術:**

| ライブラリ | 用途 |
|---|---|
| [NextAuth.js](https://authjs.dev/) v5 | Discord OAuth2 認証 |
| [Tailwind CSS](https://tailwindcss.com/) v4 | スタイリング |
| [shadcn/ui](https://ui.shadcn.com/) | UIコンポーネント |
| Biome v2 | Linter / Formatter |

### ページ構成

| パス | 内容 |
|---|---|
| `/` | ランディングページ |
| `/dashboard` | ダッシュボード（所持金・ゲーム履歴） |
| `/users` | ユーザー一覧 |
| `/users/[id]` | ユーザー詳細 |
| `/schedule/[id]` | 時報設定フォーム |
| `/minigame/coinflip` | コインフリップ |
| `/minigame/omikuji` | おみくじ |

### セットアップ

```bash
cd front-app
cp .env.example .env.local   # 環境変数を設定
bun install
bun run dev
```

### 環境変数

| 変数名 | 説明 |
|---|---|
| `NEXTAUTH_SECRET` | NextAuth シークレット |
| `AUTH_DISCORD_ID` | Discord OAuth2 クライアントID |
| `AUTH_DISCORD_SECRET` | Discord OAuth2 クライアントシークレット |
| `NEXT_PUBLIC_API_URL` | discord-bot APIのURL（例: `http://localhost:3001`） |
| `INTERNAL_API_KEY` | discord-botとの通信用APIキー |
| `DATABASE_URL` | PostgreSQL 接続文字列 |

---

## データベース

PostgreSQL を使用。Prisma スキーマは `discord-bot/prisma/schema.prisma` で管理。

```bash
cd discord-bot
bunx prisma migrate dev   # マイグレーション実行
```

## デプロイ

`discord-bot` には `Dockerfile` が含まれており、Fly.io へのデプロイを想定。

```bash
cd discord-bot
fly deploy
```
