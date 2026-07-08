import { cacheLife, cacheTag } from "next/cache";
import { auth } from "@/lib/auth";
import { createApiClient } from "@/lib/rpc-client";

/**
 * ショップアイテム一覧を取得する
 */
async function _getShopItems(callerId: string) {
  "use cache";
  cacheLife({ revalidate: 3600 });
  cacheTag("shop-items");

  const client = await createApiClient(callerId);
  const res = await client.api.shop.items.$get();
  if (!res.ok) return null;
  return await res.json();
}

export const getShopItems = async () => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getShopItems(callerId);
};

/**
 * ユーザーのインベントリを取得する
 */
async function _getUserInventory(userId: string, _callerId: string) {
  "use cache";
  cacheLife({ revalidate: 60 });
  cacheTag("shop-inventory");

  // バックエンド側は c.get("authenticatedUserId") を見るため、userIdをcreateApiClientに渡す
  const client = await createApiClient(userId);
  const res = await client.api.shop.inventory.$get();
  if (!res.ok) return null;
  return await res.json();
}

export const getUserInventory = async (userId: string) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getUserInventory(userId, callerId);
};

/**
 * アイテムを購入する
 */
export const purchaseItem = async (itemId: string) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  const client = await createApiClient(callerId);
  const res = await client.api.shop.purchase.$post({
    json: { itemId },
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    return {
      success: false,
      error: errorJson?.error?.message || "購入に失敗しました",
    };
  }
  return { success: true, data: await res.json() };
};

/**
 * アイテムを使用する（消費する）
 */
export const consumeItem = async (userItemId: string) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  const client = await createApiClient(callerId);
  const res = await client.api.shop.use.$post({
    json: { userItemId },
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    return {
      success: false,
      error: errorJson?.error?.message || "使用に失敗しました",
    };
  }
  return { success: true, data: await res.json() };
};

/**
 * ユーザーの購入履歴を取得する
 */
async function _getPurchaseHistory(userId: string, _callerId: string) {
  "use cache";
  cacheLife({ revalidate: 60 });
  cacheTag("shop-history");

  // バックエンド側は c.get("authenticatedUserId") を見るため、userIdをcreateApiClientに渡す
  const client = await createApiClient(userId);
  const res = await client.api.shop.history.$get();
  if (!res.ok) return null;
  return await res.json();
}

export const getPurchaseHistory = async (userId: string) => {
  const session = await auth();
  const callerId = session?.user?.id || "";
  return _getPurchaseHistory(userId, callerId);
};
