/**
 * HonoRPCのAppType定義
 * front-appからワークスペース依存経由で型のみをインポートする
 *
 * discord-bot/src/api/index.ts から export される AppType を re-export し、
 * front-app が @jihou/shared-types パッケージ経由でクリーンに参照できるようにする。
 *
 * discord-bot の Hono ルート型チェーンは @jihou/database パッケージ経由で
 * Prisma 生成型を参照するため、Vercel 上でも型解決が成功する。
 */
export type { AppType } from "../../discord-bot/src/api";
