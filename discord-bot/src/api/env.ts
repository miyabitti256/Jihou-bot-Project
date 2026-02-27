/**
 * Hono アプリケーション環境型定義
 * ミドルウェアで設定されるContext変数の型を定義する
 */
export type AppEnv = {
  Variables: {
    /** APIキー認証ミドルウェアで設定される認証済みユーザーID */
    authenticatedUserId: string;
  };
};
