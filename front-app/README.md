# Jihou-Bot Management Dashboard (Front-App)

> Next.js 16 App Router と Hono RPC で構築された、Jihou-Bot のためのモダンでインタラクティブな管理ダッシュボード

## 概要

本アプリケーションは、フルスタックモノレポ構成である [Jihou-Bot Project](../README.md) のフロントエンド（Web管理ダッシュボード）として機能します。こだわりの Discord 風 UI、シームレスなアニメーション、そしてバックエンドからフロントエンドに至るまでの**完全なエンドツーエンドの型安全**を実現しています。

**Next.js 16 (App Router)** を基盤とし、Server Components と Server Actions を駆使することで、クライアントサイドでの直接的なデータフェッチを排除。バックエンドである Bot API とは、**Hono RPCを用いた 型安全な S2S (Server-to-Server) 通信** を行っています。

## 主な特徴

- **エンドツーエンドの型安全**: `hono/client` を採用し、Bot側のAPIルーティングと入出力の型をフロントエンドでそのまま共有。手動での型定義やキャストを一切必要としない、コンパイルレベルでの安全性を確保しています。
- **洗練された Discord 風 UI**: ユーザーが直感的に操作できる Discord の親しみやすいデザインを踏襲。**Tailwind CSS v4** と **shadcn/ui** を利用し、細部までこだわった UI を実装しています。
- **リッチでシームレスなアニメーション**: ブラウザ標準の **View Transitions API** を活用したネイティブライクなクロスフェードページ遷移に加え、**Framer Motion** によるリッチなマイクロインタラクションを実現しています。
- **パラレルルーティングによる状態保持**: Next.js の Parallel Routes (`@sidebar`) を用いることで、複雑な階層を持つ Discord 風のサイドバーをメインコンテンツから独立してレンダリングし、ページ遷移時もシームレスな表示と状態保持を可能にしています。
- **S2S (Server-to-Server) に徹したデータフェッチ**: データの取得および更新操作（ミューテーション）は、すべて Server Components と Server Actions で完結させています。APIキーやユーザーIDといった機密情報がブラウザ側に露出することは一切ありません。
- **セキュアな認証フロー**: **NextAuth.js v5 (Auth.js)** による Discord OAuth2 認証を組み込み、発行されたセッション情報からのユーザーIDを内部API通信時のヘッダー (`X-User-Id`) に付与することで、バックエンドと連携した強固な二層認証を実現しています。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **スタイリング**: Tailwind CSS v4, shadcn/ui
- **アニメーション**: Framer Motion, View Transitions API
- **RPC クライアント**: Hono RPC (`hono/client`)
- **認証**: NextAuth.js v5 (Auth.js)
- **スキーマ検証バリデーション**: Zod
- **リンター / フォーマッター**: Biome

## アーキテクチャと設計のこだわり

### 型安全な S2S (Server-to-Server) 通信
フロントエンドは直接データベースには接続しません。バックエンドの `discord-bot` REST API に対して、Hono RPC を用いてセキュアにアクセスする中間層として振る舞います。

```typescript
// unstable_cache等の動的アクセスが制限される環境下でのS2S通信パターン
// 外側で認証情報を取得し、キャッシュ層へIDのみを渡す
export const getUserData = async (id: string) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getUserData(id, callerId);
};

const _getUserData = unstable_cache(
  async (userId: string, callerId: string) => {
    // キャッシュ内では渡された callerId を用いて認証済みクライアントを生成
    const client = await createApiClient(callerId);
    const res = await client.api.users[":userId"].$get({
      param: { userId } // パスパラメータもコンパイル時に型チェック
    });
    if (!res.ok) throw new Error("...");
    return await res.json(); // APIのレスポンス型がそのまま推論される
  },
```

### Next.js キャッシュ戦略と動的データへの最適化
Next.js 15以降の App Router では、`headers()` や `cookies()` といった動的関数（Dynamic Functions）の呼び出しがキャッシュ領域（`unstable_cache`等）内で厳しく制限されています。
本アプリケーションの `auth()`（NextAuth）関数は内部でこれらを利用しているため、**キャッシュ層での直接呼び出しはエラーとなります。**

これを解決しつつパフォーマンスを最大化するため、以下のキャッシュパターンを徹底しています。
1. **動的取得の分離**: 動的関数である `auth()` の呼び出しはキャッシュの外側の関数で行い、取得したユーザーID（`callerId`）のみをキャッシュ層に渡します。
2. **キャッシュ内での安全なクライアント生成**: `unstable_cache` でラップされた内側のフェッチ関数では、引数として受け取った `callerId` を用いて、独自の認証ヘッダーを付与したHono RPCクライアントを生成します。
3. **タグベースの再検証**: `revalidate` による時間ベースの更新に加え、`tags` を指定することで、ユーザーアクションのミューテーション後に必要なデータだけをオンデマンドでキャッシュ破棄（Revalidate）できる設計にしています。

この工夫により、各ユーザーのセッションに基づいたセキュアなデータ取得を保ちつつ、ページロードの高速化とバックエンドAPIへの負荷軽減を実現しています。上記のコード例がその一例です。

### ルーティングとUIの分離設計
Next.js App Router の強力なルーティング機能を活用し、クリーンなプロジェクト構造を維持しています。
- **Route Groups (`(dynamic) / (static)`)**: 認証が必要な動的アプリケーション領域と、LP等を含む静的ページ領域をグループ化し、レイアウトやUIの出し分けを効率化しています。
- **Parallel Routes (`@sidebar`)**: 独立したライフサイクルを持つサイドバーをパラレルルートとして分離し、メイン領域のナビゲーションに依存しない高度なUI構築を実現しました。

### パフォーマンスを意識したアニメーション設計
Next.js側での `ViewTransitions API` の有効化により、JavaScriptによるDOMの再描画コストを抑えつつ、OSネイティブのようなクロスフェードや要素のモーフィングアニメーションを実装。高いユーザーエクスペリエンスを提供します。
