import { db } from "@bot/lib/db";
import { userItems, users } from "@jihou/database";
import { eq } from "drizzle-orm";
import { SHOP_ITEMS } from "./shop-items";

export type ItemEffectErrorCode =
  | "ITEM_NOT_FOUND"
  | "ALREADY_USED"
  | "INVALID_USER"
  | "UNKNOWN_EFFECT";

export class ItemEffectError extends Error {
  constructor(public code: ItemEffectErrorCode) {
    super(code);
    this.name = "ItemEffectError";
  }
}

export async function useItem(
  userId: string,
  userItemId: string,
): Promise<{ success: boolean; itemId: string; effect: string }> {
  return await db.transaction(async (tx) => {
    // ユーザーアイテムの検索
    const userItem = await tx.query.userItems.findFirst({
      where: eq(userItems.id, userItemId),
    });

    if (!userItem) {
      throw new ItemEffectError("ITEM_NOT_FOUND");
    }

    // 所有者チェック
    if (userItem.userId !== userId) {
      throw new ItemEffectError("INVALID_USER");
    }

    // 使用済みチェック
    if (userItem.usedAt !== null) {
      throw new ItemEffectError("ALREADY_USED");
    }

    // アイテム効果の検索
    const shopItem = SHOP_ITEMS.find((item) => item.id === userItem.itemId);
    if (!shopItem) {
      throw new ItemEffectError("ITEM_NOT_FOUND");
    }

    // 効果に応じた処理
    if (shopItem.effect === "omikuji_redraw") {
      // おみくじの本日制限を解除 (lastDraw を null に)
      await tx
        .update(users)
        .set({
          lastDraw: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      throw new ItemEffectError("UNKNOWN_EFFECT");
    }

    // アイテムを使用済みに更新
    await tx
      .update(userItems)
      .set({
        usedAt: new Date(),
      })
      .where(eq(userItems.id, userItemId));

    return {
      success: true,
      itemId: userItem.itemId,
      effect: shopItem.effect,
    };
  });
}
