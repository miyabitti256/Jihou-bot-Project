import { PrismaClient } from "@bot/generated/prisma/client/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "./env";

const connectionString = env.DATABASE_URL;

// 512MBメモリ環境向けにコネクション数を制限
// デフォルト10 → 3に削減し、アイドル接続のメモリ消費を抑える
const pool = new Pool({
  connectionString,
  max: 3,
  idleTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

// Raw SQL用にpoolを直接エクスポート（Prismaのupsertオーバーヘッドを回避するため）
export { pool };
