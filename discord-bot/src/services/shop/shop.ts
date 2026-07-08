import { db } from "@bot/lib/db";
import { getTokyoDate } from "@bot/lib/utils";
import { purchaseHistory, userItems, users } from "@jihou/database";
import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq, gte, isNull } from "drizzle-orm";
import { SHOP_ITEMS, type ShopItem } from "./shop-items";

export type ShopErrorCode =
  | "USER_NOT_FOUND"
  | "ITEM_NOT_FOUND"
  | "INSUFFICIENT_FUNDS"
  | "DAILY_LIMIT_EXCEEDED"
  | "ITEM_DISABLED";

export class ShopError extends Error {
  constructor(public code: ShopErrorCode) {
    super(code);
    this.name = "ShopError";
  }
}

export function getShopItems(): ShopItem[] {
  return SHOP_ITEMS.filter((item) => item.enabled);
}

export async function getPurchaseCountToday(
  userId: string,
  itemId: string,
): Promise<number> {
  const today = getTokyoDate();
  const purchases = await db.query.purchaseHistory.findMany({
    where: and(
      eq(purchaseHistory.userId, userId),
      eq(purchaseHistory.itemId, itemId),
      gte(purchaseHistory.createdAt, today),
    ),
  });
  return purchases.length;
}

export async function purchaseItem(
  userId: string,
  itemId: string,
): Promise<ShopItem> {
  // アイテムの存在および有効化チェック
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) {
    throw new ShopError("ITEM_NOT_FOUND");
  }
  if (!item.enabled) {
    throw new ShopError("ITEM_DISABLED");
  }

  return await db.transaction(async (tx) => {
    // ユーザー存在チェック (トランザクション内)
    const user = await tx.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) {
      throw new ShopError("USER_NOT_FOUND");
    }

    // 所持金チェック
    if (user.money < item.price) {
      throw new ShopError("INSUFFICIENT_FUNDS");
    }

    // 購入制限チェック (JST本日)
    const today = getTokyoDate();
    const purchases = await tx.query.purchaseHistory.findMany({
      where: and(
        eq(purchaseHistory.userId, userId),
        eq(purchaseHistory.itemId, itemId),
        gte(purchaseHistory.createdAt, today),
      ),
    });

    if (purchases.length >= item.maxPerDay) {
      throw new ShopError("DAILY_LIMIT_EXCEEDED");
    }

    // DB更新
    // 1. お金を引く
    await tx
      .update(users)
      .set({
        money: user.money - item.price,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // 2. 購入履歴を記録
    const purchaseId = createId();
    await tx.insert(purchaseHistory).values({
      id: purchaseId,
      userId,
      itemId,
      price: item.price,
    });

    // 3. ユーザーアイテムを追加
    const userItemId = createId();
    await tx.insert(userItems).values({
      id: userItemId,
      userId,
      itemId,
      purchaseId,
    });

    return item;
  });
}

export async function getUserInventory(userId: string) {
  return await db.query.userItems.findMany({
    where: and(eq(userItems.userId, userId), isNull(userItems.usedAt)),
  });
}

export async function getPurchaseHistory(userId: string) {
  return await db.query.purchaseHistory.findMany({
    where: eq(purchaseHistory.userId, userId),
    orderBy: desc(purchaseHistory.createdAt),
  });
}
