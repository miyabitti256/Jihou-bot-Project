import { cacheLife, cacheTag } from "next/cache";
import { auth } from "@/lib/auth";
import { createApiClient } from "@/lib/rpc-client";

/**
 * ユーザー情報を取得する
 */
async function _getUser(
  userId: string,
  callerId: string,
  includes?: ("scheduledmessage" | "omikuji" | "coinflip" | "janken")[],
) {
  "use cache";
  cacheLife({ revalidate: 60 });
  cacheTag("user-info");

  const client = await createApiClient(callerId);
  const res = await client.api.users[":userId"].$get({
    param: { userId },
    query: includes ? { includes } : {},
  });
  if (!res.ok) return null;
  return await res.json();
}

export const getUser = async (
  userId: string,
  includes?: ("scheduledmessage" | "omikuji" | "coinflip" | "janken")[],
) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getUser(userId, callerId, includes);
};

/**
 * 共有ギルドのユーザー一覧を取得する
 */
async function _getGuildUsers(
  userId: string,
  callerId: string,
  query?: { page?: string; limit?: string; search?: string },
) {
  "use cache";
  cacheLife({ revalidate: 60 });
  cacheTag("guild-users");

  const client = await createApiClient(callerId);
  const res = await client.api.users.guilds[":userId"].$get({
    param: { userId },
    query: query ?? {},
  });
  if (!res.ok) return null;
  return await res.json();
}

export const getGuildUsers = async (
  userId: string,
  query?: { page?: string; limit?: string; search?: string },
) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getGuildUsers(userId, callerId, query);
};
