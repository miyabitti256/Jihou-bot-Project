import { cacheLife, cacheTag } from "next/cache";
import { auth } from "@/lib/auth";
import { createApiClient } from "@/lib/rpc-client";

/**
 * おみくじ結果を取得する
 */
async function _getOmikujiResults(
  userId: string,
  callerId: string,
  take?: string,
) {
  "use cache";
  cacheLife({ revalidate: 60 });
  cacheTag("omikuji-results");

  const client = await createApiClient(callerId);
  const res = await client.api.minigame.omikuji.result[":userId"].$get({
    param: { userId },
    query: take ? { take } : {},
  });
  if (!res.ok) return null;
  return await res.json();
}

export const getOmikujiResults = async (userId: string, take?: string) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getOmikujiResults(userId, callerId, take);
};
