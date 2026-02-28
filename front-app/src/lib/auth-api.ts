"use server";

import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

/**
 * Server Action用の認証ヘッダーを取得
 * APIキー + X-User-Id ヘッダー方式
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await auth();

  const headers: Record<string, string> = {
    "X-API-Key": env.API_KEY,
    "Content-Type": "application/json",
  };

  if (session?.user?.id) {
    headers["X-User-Id"] = session.user.id;
  }

  return headers;
}
