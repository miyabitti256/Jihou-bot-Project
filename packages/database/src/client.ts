/**
 * データベースクライアント作成ヘルパー
 *
 * PrismaClient + pg Pool のセットアップを一箇所にまとめる。
 * discord-bot から呼び出される。
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/client/client";

export function createDatabaseClient(connectionString: string) {
  // 512MBメモリ環境向けにコネクション数を制限
  // デフォルト10 → 3に削減し、アイドル接続のメモリ消費を抑える
  const pool = new Pool({
    connectionString,
    max: 3,
    idleTimeoutMillis: 10000,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  return { prisma, pool };
}
