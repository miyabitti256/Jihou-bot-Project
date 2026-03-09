import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth";
import { createApiClient } from "@/lib/rpc-client";

/**
 * おみくじ結果を取得する
 */
const _getOmikujiResults = unstable_cache(
  async (userId: string, callerId: string, take?: string) => {
    const client = await createApiClient(callerId);
    const res = await client.api.minigame.omikuji.result[":userId"].$get({
      param: { userId },
      query: take ? { take } : {},
    });
    if (!res.ok) return null;
    return await res.json();
  },
  ["omikuji-results"],
  { revalidate: 60, tags: ["omikuji-results"] },
);

export const getOmikujiResults = async (userId: string, take?: string) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getOmikujiResults(userId, callerId, take);
};
