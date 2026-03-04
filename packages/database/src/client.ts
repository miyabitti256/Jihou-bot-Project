/**
 * データベースクライアント作成ヘルパー
 *
 * Drizzle ORM + pg Pool のセットアップを一箇所にまとめる。
 * discord-bot から呼び出される。
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as relations from "./relations";
import * as schema from "./schema";

export function createDatabaseClient(connectionString: string) {
  // 512MBメモリ環境向けにコネクション数を制限
  // デフォルト10 → 3に削減し、アイドル接続のメモリ消費を抑える
  const pool = new Pool({
    connectionString,
    max: 3,
    idleTimeoutMillis: 10000,
  });
  const db = drizzle(pool, { schema: { ...schema, ...relations } });

  return { db, pool };
}
