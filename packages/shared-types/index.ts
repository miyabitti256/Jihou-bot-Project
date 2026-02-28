/**
 * HonoRPCのAppType定義
 * front-appからワークスペース依存経由で型のみをインポートする
 *
 * discord-bot/src/api/index.ts から export される AppType を re-export し、
 * front-app が @jihou/shared-types パッケージ経由でクリーンに参照できるようにする。
 */
export type { AppType } from "../../discord-bot/src/api";
