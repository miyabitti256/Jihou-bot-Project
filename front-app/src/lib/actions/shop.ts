"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { consumeItem, purchaseItem } from "@/lib/api/shop";

export async function purchaseItemAction(itemId: string) {
  try {
    const result = await purchaseItem(itemId);

    if (result.success) {
      // キャッシュのリバリデーション
      revalidateTag("shop-inventory", "max");
      revalidateTag("user-info", "max");
      revalidateTag("shop-history", "max");
      revalidatePath("/dashboard");
    }

    return result;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Log error on server action
    console.error("[purchaseItemAction] error:", error);
    return { success: false, error: "内部サーバーエラーが発生しました" };
  }
}

export async function consumeItemAction(userItemId: string) {
  try {
    const result = await consumeItem(userItemId);

    if (result.success) {
      // キャッシュのリバリデーション
      revalidateTag("shop-inventory", "max");
      revalidateTag("omikuji-results", "max");
      revalidateTag("user-info", "max");
      revalidatePath("/dashboard");
      revalidatePath("/minigame/omikuji");
    }

    return result;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Log error on server action
    console.error("[consumeItemAction] error:", error);
    return { success: false, error: "内部サーバーエラーが発生しました" };
  }
}
