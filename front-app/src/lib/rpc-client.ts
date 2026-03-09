import type { AppType } from "@jihou/shared-types";
import { hc } from "hono/client";
import { getAuthHeaders } from "./auth-api";
import { env } from "./env";

/**
 * HonoRPCクライアントを作成する
 * Server Component / Server Action 内で使用し、認証ヘッダーを自動付与する
 */
export async function createApiClient(explicitUserId?: string | null) {
  let headers: Record<string, string>;
  if (explicitUserId !== undefined) {
    headers = {
      "X-API-Key": env.API_KEY,
      "Content-Type": "application/json",
    };
    if (explicitUserId) {
      headers["X-User-Id"] = explicitUserId;
    }
  } else {
    headers = await getAuthHeaders();
  }

  const client = hc<AppType>(env.API_URL, {
    headers,
  });

  return client;
}
