"use server";

import { auth } from "@/lib/auth";

/**
 * Server Action用の認証ヘッダーを取得
 * APIキー + X-User-Id ヘッダー方式
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await auth();

  const headers: Record<string, string> = {
    "X-API-Key": process.env.API_KEY as string,
    "Content-Type": "application/json",
  };

  if (session?.user?.id) {
    headers["X-User-Id"] = session.user.id;
  }

  return headers;
}

/**
 * 認証済みfetchのヘルパー関数
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers = await getAuthHeaders();

  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}