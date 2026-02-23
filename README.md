# Jihou-Bot Project

Discordサーバー向け多機能Botと管理用Webフロントエンドからなる**フルスタックモノレポ**。  
Bot本体がHono製REST APIを内包するサービスドリブンなアーキテクチャを採用し、Next.jsフロントエンドとのServer-to-Server通信を設計の中核に置いている。

---

## システムアーキテクチャ

```
┌──────────────────────────────────────────────────────────────┐
│  Discord                                                     │
│  ・スラッシュコマンド                                           │
│  ・イベント (guildCreate / guildMemberAdd / messageCreate等)  │
└───────────────────┬──────────────────────────────────────────┘
                    │ Gateway (discord.js)
                    ▼
┌──────────────────────────────────────────────────────────────┐
│  discord-bot  (Bun + discord.js + Hono)                      │
│                                                              │
│  ┌─────────────┐  ┌──────────────────────┐                  │
│  │  Bot Core   │  │  REST API (Hono)      │                  │
│  │  commands/  │  │  /api/guilds          │                  │
│  │  handler/   │  │  /api/users           │◄─── HTTPS S2S ───┐
│  │  services/  │  │  /api/minigame        │                  │
│  └──────┬──────┘  └──────────┬───────────┘                  │
│         └──────────┬─────────┘                              │
│                    ▼                                         │
│   ┌────────────────────────────────┐                        │
│   │  Service Layer                 │                        │
│   │  services/guilds/              │                        │
│   │  services/minigame/            │                        │
│   │  services/users/               │                        │
│   │  services/db-sync/ (毎時同期)   │                        │
│   └──────────────┬─────────────────┘                        │
│                  │ (Prisma v7 + pg adapter)                  │
└──────────────────┼───────────────────────────────────────────┘
                   │
                   ▼
          ┌─────────────────┐
          │  PostgreSQL      │
          └─────────────────┘
           DBアクセスはdiscord-botのみ
           （front-appにPrismaの依存は存在しない）
┌──────────────────────────────────────────────────────────────┐
│  front-app  (Next.js 15 App Router)                          │
│                                                              │
│  Server Actions / Server Components                          │
│     └─ 全データアクセス → discord-bot API経由 (S2S) ─────────┘
│                                                              │
│  Discord OAuth2 (NextAuth.js v5)                             │
│     └─ session.user.id → X-User-Id ヘッダーに乗せてS2S通信   │
└──────────────────────────────────────────────────────────────┘
         │
         ▼ (ブラウザ)
┌─────────────────────────┐
│  User  (Discord認証済み) │
└─────────────────────────┘
```

---

## 設計の軸

### 1. Server-to-Server (S2S) 通信

フロントエンド（Next.js Server Actions）からBotのAPIへの通信はすべてサーバーサイドで完結する。

```
ブラウザ → Next.js Server Action → discord-bot API
                ↑
           クライアントにAPIキーは一切露出しない
```

`front-app/src/lib/auth-api.ts` にAPIキーとユーザーIDを付与するヘルパーを集約し、認証情報が必要な全てのfetchがここを通る形を徹底している。

```typescript
// auth-api.ts （"use server" スコープ）
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await auth();        // NextAuth セッション取得
  return {
    "X-API-Key": process.env.API_KEY,  // サーバー環境変数のみ
    "X-User-Id": session?.user?.id,    // 認証済みユーザーID
  };
}
```

### 2. APIキー + ユーザーID 二層認証

discord-bot のAPI（Hono）は2種類の認証ミドルウェアで保護する。

| ミドルウェア | 適用ルート | 検証内容 |
|---|---|---|
| `apiKeyAuthMiddleware` | `/guilds/*` | `X-API-Key` のみ |
| `apiKeyWithUserAuthMiddleware` | `/users/*` `/minigame/*` | APIキー + `X-User-Id` の一致検証 |

`apiKeyWithUserAuthMiddleware` はURLパラメータ・リクエストボディ・クエリパラメータに含まれる `userId` と `X-User-Id` ヘッダーを照合し、**他ユーザーのデータへの横断アクセスをAPIレベルで防ぐ**。

`X-User-Id` はフロントエンドの `auth-api.ts` が NextAuth セッションから自動付与する。リクエストボディや URL パラメータも同じくフロントエンドが送信するが、Bot API 側でこれらを照合することで、万が一変造されたリクエストが届いても **認証済みユーザー以外のデータを操作できない**構造になっている。

```
# 正常リクエスト（認証済みユーザーが自分のデータにアクセス）
POST /api/users/123456789/money
  X-API-Key: xxxxxxxx   ← front-app サーバー環境変数（ブラウザに非公開）
  X-User-Id: 123456789  ← NextAuth セッション由来のDiscord ID
  → 203 OK

# 横断アクセス試行（他ユーザーのデータを操作しようとした場合）
POST /api/users/987654321/money   ← 他ユーザーのID
  X-User-Id: 123456789            ← 自分のセッションID
  → 403 Forbidden
```

### 3. サービス層のみがDBに触れる

Prismaクライアントへのアクセスはすべて `services/` 配下に閉じており、`api/routes/` はサービス関数を呼ぶだけで直接クエリを書かない。

```
api/routes/minigame/coinflip.ts
  └─ import { playCoinflip } from "@services/minigame/coinflip"
         └─ prisma.users.findUnique(...)   ← DBアクセスはここだけ
```

**フロントエンドはDBに一切直接アクセスしない**。`front-app/package.json` に `prisma` や `@prisma/client` の依存が存在しないことがその証拠である。データの読み書きはすべて discord-bot API への S2S リクエスト経由とすることで、ビジネスロジック・DBスキーマの詳細をBotサーバー内に完全に閉じ込めている。

### 4. Zodによる一元バリデーション

`api/schemas.ts` に全エンドポイント共通のZodスキーマを定義し、ルートハンドラで `safeParse` を行う。

```typescript
// schemas.ts
export const discordIdSchema = z.string().min(1).regex(/^\d+$/, "Invalid ID format");
export const coinflipPlaySchema = z.object({ bet: z.number().int().min(1), choice: z.enum(["heads", "tails"]) });
```

バリデーション失敗時は一貫した `{ error: { code, message, details } }` フォーマットで返却する。

### 5. メモリを意識したDiscord.jsキャッシュ設定

512MB制限のデプロイ環境に合わせ、`Client` に`makeCache`制限を適用してメモリフットプリントを最小化している。

```typescript
makeCache: Options.cacheWithLimits({
  MessageManager: 0,          // AIハンドラはMessageオブジェクトを直接受け取るため不要
  GuildMemberManager: 200,    // LRU・サーバーごと上限200（イベント処理分のみ保持）
  UserManager: 0,
  ReactionManager: 0,
})
```

メンバーの全件同期は `guild.members.list()` のページネーション（1000件/回）で実施し、各バッチをDB書き込み後に即キャッシュから追い出す設計とした。

### 6. ユーザーID単位のレート制限

`lib/rate-limiter.ts` でユーザーID × エンドポイントパスをキーとするスライディングウィンドウ型のレートリミッターを実装し、ゲーム系APIの連打・乱用を防ぐ。

```
defaultRateLimiter   → 10秒間に20リクエスト（/users, /minigame）
mutationRateLimiter  → 10秒間に15リクエスト（/guilds 書き込み系）
```

---

## 技術スタック

### discord-bot

| 技術 | 用途 |
|---|---|
| **Bun** | ランタイム・パッケージマネージャ |
| **discord.js v14** | Discord Gatewayクライアント |
| **Hono v4** | 軽量REST APIフレームワーク |
| **Prisma v7 + pg** | ORM（`@prisma/adapter-pg` でpgネイティブ接続） |
| **Zod** | スキーマバリデーション |
| **node-cron** | 毎時ギルド同期・時報スケジューラ |
| **Google Gemini** (`@google/genai`) | AIチャット・おみくじ解説生成 |
| **Pino** | 構造化ロギング |
| **Biome** | Linter / Formatter |
| **Fly.io + Docker** | デプロイ先 |

### front-app

| 技術 | 用途 |
|---|---|
| **Next.js 15** (App Router) | フロントエンドフレームワーク |
| **NextAuth.js v5** | Discord OAuth2認証 |
| **Tailwind CSS v4** | スタイリング |
| **shadcn/ui** | UIコンポーネントライブラリ |
| **Biome** | Linter / Formatter |

---

## 主な機能

| 機能 | 説明 |
|---|---|
| **時報** | 指定チャンネルに毎日指定時刻にメッセージ送信（node-cron） |
| **AIチャット** | Google Gemini を使ったスレッド単位の会話履歴保持チャット |
| **コインフリップ** | 所持金を賭けるミニゲーム。残高はDBで管理 |
| **おみくじ** | 1日1回制のおみくじ（AI解説生成オプション）＋ロール自動付与 |
| **じゃんけん** | 他のDiscordユーザーとの対戦型ミニゲーム |
| **ギルド同期** | 毎時バッチでチャンネル・ロール・全メンバーをDBに同期 |
| **管理フロントエンド** | スケジュールメッセージ管理・ユーザー一覧・ダッシュボード |

---

## ディレクトリ構成

```
Jihou-bot-Project/
├── discord-bot/
│   ├── src/
│   │   ├── api/
│   │   │   ├── routes/         # ルートハンドラ（バリデーション + サービス呼び出しのみ）
│   │   │   ├── schemas.ts      # 全エンドポイント共通Zodスキーマ
│   │   │   └── index.ts        # Honoアプリ + ミドルウェア構成
│   │   ├── commands/           # スラッシュコマンド実装
│   │   ├── handler/            # Discordイベントハンドラ・コマンドローダー
│   │   ├── services/           # ビジネスロジック + 唯一のDBアクセス層
│   │   │   ├── chat/           # Gemini AIチャットサービス
│   │   │   ├── db-sync/        # ギルド全データ同期（ページネーション）
│   │   │   ├── discord/        # Discord REST APIラッパー
│   │   │   ├── guilds/         # ギルド・時報スケジューラサービス
│   │   │   ├── minigame/       # ゲームロジック（coinflip, omikuji, janken）
│   │   │   └── users/          # ユーザーサービス
│   │   └── lib/
│   │       ├── auth.ts         # 二層認証ミドルウェア
│   │       ├── client.ts       # Discord.js クライアント（makeCache設定）
│   │       ├── rate-limiter.ts # ユーザーID単位レートリミッター
│   │       ├── prisma.ts       # Prismaクライアントシングルトン
│   │       └── status-updater.ts # 毎時同期スケジューラ
│   ├── prisma/schema.prisma
│   ├── prisma.config.ts
│   └── Dockerfile
└── front-app/
    └── src/
        ├── app/                # App Router ページ
        ├── components/         # UIコンポーネント
        └── lib/
            ├── auth.ts         # NextAuth設定
            └── auth-api.ts     # S2S通信用認証ヘッダーヘルパー（Server専用）
```
