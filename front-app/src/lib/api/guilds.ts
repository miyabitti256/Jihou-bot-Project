import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth";
import { createApiClient } from "@/lib/rpc-client";

/**
 * ギルド情報を取得する
 *
 * 【キャッシュ戦略と制限事項について】
 * Next.js の `unstable_cache` の中では `headers()` や `cookies()` などの動的(Dynamic)なデータアクセスが許可されていません。
 * `auth()` 関数は内部でこれらを利用しているため、`unstable_cache` の中から間接的に `auth()` を呼ぶだけで実行時エラーとなります。
 *
 * そのため、本ファイル（および users.ts, minigame.ts 等）では以下のような設計にしています。
 * 1. 外側の関数（例: `getGuild`）で先に `auth()` を呼び、ユーザーID（callerId）を取得する。
 * 2. 内側の関数（例: `_getGuild`）は `unstable_cache` でラップし、外から渡された callerId を引数として受け取る。
 * 3. `createApiClient(callerId)` により、キャッシュ化されたスコープ内で依存なく認証済みクライアントを生成する。
 */
const _getGuild = unstable_cache(
  async (
    guildId: string,
    callerId: string,
    includes?: ("roles" | "channels" | "messages" | "members")[],
  ) => {
    const client = await createApiClient(callerId);
    const res = await client.api.guilds[":guildId"].$get({
      param: { guildId },
      query: includes ? { includes } : {},
    });
    if (!res.ok) return null;
    return await res.json();
  },
  ["guild-info"],
  { revalidate: 60, tags: ["guild-info"] },
);

export const getGuild = async (
  guildId: string,
  includes?: ("roles" | "channels" | "messages" | "members")[],
) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getGuild(guildId, callerId, includes);
};

/**
 * Discord ギルド情報を取得する
 */
const _getGuildDiscord = unstable_cache(
  async (guildId: string, callerId: string) => {
    const client = await createApiClient(callerId);
    const res = await client.api.guilds[":guildId"].discord.$get({
      param: { guildId },
    });
    if (!res.ok) return null;
    return await res.json();
  },
  ["guild-discord-info"],
  { revalidate: 60, tags: ["guild-discord-info"] },
);

export const getGuildDiscord = async (guildId: string) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getGuildDiscord(guildId, callerId);
};

/**
 * ユーザーの所属ギルド一覧を取得する
 */
const _getGuildMembers = unstable_cache(
  async (userId: string, callerId: string) => {
    const client = await createApiClient(callerId);
    const res = await client.api.guilds.members[":userId"].$get({
      param: { userId },
    });
    if (!res.ok) return null;
    return await res.json();
  },
  ["user-guilds"],
  { revalidate: 60, tags: ["user-guilds"] },
);

export const getGuildMembers = async (userId: string) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getGuildMembers(userId, callerId);
};

/**
 * ギルドのチャンネル一覧を取得する
 */
const _getGuildChannels = unstable_cache(
  async (guildId: string, callerId: string) => {
    const client = await createApiClient(callerId);
    const res = await client.api.guilds[":guildId"].channels.$get({
      param: { guildId },
    });
    if (!res.ok) return null;
    return await res.json();
  },
  ["guild-channels"],
  { revalidate: 60, tags: ["guild-channels"] },
);

export const getGuildChannels = async (guildId: string) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getGuildChannels(guildId, callerId);
};

/**
 * スケジュール詳細を取得する
 */
const _getScheduleDetails = unstable_cache(
  async (id: string, callerId: string) => {
    const client = await createApiClient(callerId);
    const res = await client.api.guilds.scheduledmessage.details[":id"].$get({
      param: { id },
    });
    if (!res.ok) return null;
    return await res.json();
  },
  ["schedule-details"],
  { revalidate: 60, tags: ["schedule-details"] },
);

export const getScheduleDetails = async (id: string) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getScheduleDetails(id, callerId);
};
