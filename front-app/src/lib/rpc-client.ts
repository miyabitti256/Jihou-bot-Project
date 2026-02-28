import type { AppType } from "@api-types";
import { hc } from "hono/client";
import { getAuthHeaders } from "./auth-api";
import { env } from "./env";

/**
 * HonoRPCクライアントを作成する
 * Server Component / Server Action 内で使用し、認証ヘッダーを自動付与する
 */
export async function createApiClient() {
  const headers = await getAuthHeaders();

  const client = hc<AppType>(env.API_URL, {
    headers,
  });

  return client;
}
