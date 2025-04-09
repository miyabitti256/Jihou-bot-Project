# Jihou-bot コーディング規約

## 基本原則

1. **一貫性のあるコーディングスタイル**: プロジェクト全体で一貫性のあるコーディングスタイルを維持する。
2. **可読性**: 他の開発者が容易に理解できるコードを書く。
3. **保守性**: 将来的な変更や拡張が容易になるよう、コードを構造化する。

## ファイル構成

1. **インポート順序**:
   - 標準ライブラリや外部モジュールを最初にインポート
   - プロジェクト内部のモジュールを次にインポート
   - 相対パスよりも絶対パス（`@/lib/...`）を優先

```typescript
// 良い例
import { type as Type } from "node:module";
import { ExternalDependency } from "external-package";
import { UtilityFunction } from "@/lib/utils";
```

2. **定数定義**:
   - APIエンドポイントなどの定数は、ファイル上部でグローバル定数として定義
   - `as const` を使用して型を固定

```typescript
const CONSTANTS = {
  API_ENDPOINT: "http://localhost:3001/api/chat",
} as const;
```

## コマンド構造

1. **データ定義**:
   - すべてのコマンドは `data` 変数でSlashCommandBuilderインスタンスを定義
   - 説明文は簡潔かつ明確に

2. **実行関数**:
   - `execute` 関数で実装
   - 関数定義は `export async function execute` の形式に統一

```typescript
export async function execute(interaction: ChatInputCommandInteraction) {
  // 処理の実装
}
```

## エラーハンドリング

1. **try-catch ブロック**:
   - 外部APIとの通信など、失敗する可能性のある処理は try-catch で囲む
   - エラーは適切にログに記録する

2. **ログ記録**:
   - エラーログには以下の情報を含める:
     - コマンド名またはファイル名（`[commandName]` の形式）
     - エラーの種類や説明
     - 可能であればエラーオブジェクトやレスポンス本文

```typescript
try {
  // 処理
} catch (error) {
  logger.error(`[commandName] Error description: ${error}`);
  // ユーザーへのエラー通知
}
```

## 型定義

1. **明示的な型付け**:
   - 変数、関数の引数、戻り値には明示的に型を付ける
   - `any` 型の使用は避け、より具体的な型を使用する

2. **型アサーション**:
   - 必要な場合のみ型アサーションを使用
   - `as` 構文を優先し、`<Type>` 構文は避ける

```typescript
// 良い例
const userId = interaction.user.id as string;

// 避けるべき例
const userId = <string>interaction.user.id;
```

## チャンネル処理

1. **チャンネルタイプの処理**:
   - 適切な型定義を使用してチャンネルタイプに応じた処理を行う
   - 未知のチャンネルタイプには適切なエラーハンドリングを提供

```typescript
if (channel.type === ChannelType.GuildText) {
  // テキストチャンネル処理
} else if (channel.type === ChannelType.DM) {
  // DMチャンネル処理
} else {
  // その他のケース
}
```

## コメント

1. **コメントの目的**:
   - コメントは複雑なロジックや非直感的な処理の説明にのみ使用する
   - 明らかな処理や関数名から意図が明確な場合はコメントを省略する
   - 「何を」ではなく「なぜ」や「どのように」に焦点を当てる

2. **不要なコメントを避ける**:
   - 以下のようなコメントは避ける:
     - 関数名や変数名が既に説明している内容を繰り返すコメント
     - 定数宣言や単純な代入などの明白な処理に対するコメント
     - コードの各行に対する冗長な説明

```typescript
// 避けるべき例
// ユーザーIDを取得する
const userId = interaction.user.id;

// 良い例
// IAMポリシーの制限により、プライマリキーとセカンダリキーの両方を検証
if (validatePrimaryKey(token) || validateSecondaryKey(token)) {
  // 処理
}
```

3. **JSDocの適切な使用**:
   - JSDocは以下の場合に利用する:
     - 複雑な関数や重要なAPIの詳細な説明が必要な場合
     - 特別な引数の要件や戻り値の仕様がある場合
     - エラー処理や副作用について注意喚起が必要な場合
   - 単純な関数や自明な処理にはJSDocを省略してよい

```typescript
// 適切なJSDocの例
/**
 * 認証トークンを検証し、有効期限と署名を確認する
 * @param token 検証するJWTトークン
 * @param options 検証オプション（アルゴリズム、発行者など）
 * @returns 検証結果とデコードされたペイロード
 * @throws {TokenExpiredError} トークンの有効期限が切れている場合
 * @throws {JsonWebTokenError} 署名が無効な場合
 */
function verifyAuthToken(token: string, options?: VerifyOptions): TokenResult {
  // 実装
}

// JSDocが不要な例
function getUserName(user: User): string {
  return user.displayName || user.username;
}
```

4. **コードブロックコメント**:
   - 大きなコードブロックには、そのブロックの目的や処理概要を説明するコメントを付ける
   - コードブロックの開始時に記述し、ブロック全体の文脈を提供する

```typescript
// ユーザー入力を検証し、不正な値があればエラーレスポンスを返す
// 検証ルール:
// 1. 名前は3文字以上20文字以下
// 2. メールアドレスは有効な形式
// 3. パスワードは8文字以上で英数字記号を含む
if (!validateName(name)) {
  return { error: "Invalid name" };
}
// 以下検証処理が続く
```

## APIリクエスト

1. **エンドポイント管理**:
   - APIエンドポイントは定数として定義
   - URLの直接ハードコーディングは避ける

2. **レスポンス処理**:
   - `response.ok` で応答ステータスを確認
   - エラーレスポンスは適切にログに記録
   - ユーザーには分かりやすいエラーメッセージを提供

## ファイル名と変数名

1. **ファイル命名規則**:
   - コマンドファイルはケバブケース（`command-name.ts`）
   - ライブラリファイルはキャメルケース（`utilityName.ts`）

2. **変数・関数名**:
   - 変数と関数はキャメルケース（`functionName`）
   - クラスや型はパスカルケース（`ClassName`）
   - 定数は大文字スネークケース（`CONSTANT_NAME`）または定数オブジェクト内のキャメルケース

## Honoを使ったAPI実装

1. **APIルーティング構造**:
   - 関連するエンドポイントはサブルーティングにまとめる
   - ルートモジュールは `index.ts` に定義
   - 機能ごとにディレクトリを分割

```typescript
// src/api/routes/feature/index.ts
export const feature = new Hono();
feature.get("/item", getItem);
feature.post("/item", createItem);

// src/api/index.ts
app.route("/feature", feature);
```

2. **レスポンス形式の統一**:
   - すべてのAPIレスポンスは統一された形式を持つ
   - 成功時: `{ status: "success", data: { ... } }`
   - エラー時: `{ status: "error", error: { code: "ERROR_CODE", message: "エラーメッセージ", details: ... } }`

```typescript
// 成功レスポンス
return c.json({
  status: "success",
  data: {
    item: result,
  },
});

// エラーレスポンス
return c.json({
  status: "error",
  error: {
    code: "ITEM_NOT_FOUND",
    message: "指定されたアイテムが見つかりません",
    details: null,
  },
}, 404);
```

3. **エラーハンドリング**:
   - すべてのルートハンドラは try-catch ブロックで囲む
   - エラーは適切なステータスコードとともに返す
   - エラーの詳細は開発環境でのみ返す

```typescript
try {
  // 処理
} catch (error) {
  logger.error(`[api] Error handling request: ${error}`);
  return c.json({
    status: "error",
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "サーバー内部エラーが発生しました",
      details: process.env.NODE_ENV === "development" ? error : null,
    },
  }, 500);
}
```

4. **ミドルウェア**:
   - 認証やロギングなどの共通機能はミドルウェアとして実装
   - ミドルウェアは再利用可能な関数として定義

```typescript
const authMiddleware = async (c: Context, next: Next) => {
  const apiKey = c.req.header("X-API-Key");
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return c.json({
      status: "error", 
      error: {
        code: "UNAUTHORIZED",
        message: "認証に失敗しました",
      },
    }, 401);
  }
  await next();
};
```

5. **パラメータバリデーション**:
   - リクエストパラメータは常に検証
   - 必須パラメータがない場合は早期リターン

```typescript
const body = await c.req.json();
const { userId, content } = body;

if (!userId || !content) {
  return c.json({
    status: "error",
    error: {
      code: "MISSING_REQUIRED_FIELDS",
      message: "必須パラメータが不足しています",
    },
  }, 400);
}
```

6. **非同期処理**:
   - すべてのルートハンドラは async 関数として定義
   - Promise の連鎖よりも await を使用

```typescript
// 良い例
app.get("/items/:id", async (c) => {
  const id = c.req.param("id");
  const item = await fetchItem(id);
  return c.json({ status: "success", data: { item } });
});

// 避けるべき例
app.get("/items/:id", (c) => {
  const id = c.req.param("id");
  return fetchItem(id).then(item => {
    return c.json({ status: "success", data: { item } });
  });
});
```

7. **トランザクション**:
   - 複数のデータベース操作が必要な場合はトランザクションを使用
   - エラーハンドリングをトランザクション内で適切に行う

```typescript
await prisma.$transaction(async (tx) => {
  const user = await tx.users.update({
    where: { id: userId },
    data: { points: { increment: points } },
  });
  
  await tx.pointHistory.create({
    data: {
      userId,
      points,
      reason: "ポイント獲得",
    },
  });
}); 
```
