import { logger } from "@bot/lib/logger";
import { ItemEffectError, useItem } from "@bot/services/shop/item-effects";
import {
  getPurchaseHistory,
  getShopItems,
  getUserInventory,
  purchaseItem,
  ShopError,
} from "@bot/services/shop/shop";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AppEnv } from "../env";
import { purchaseItemSchema, useItemSchema } from "../schemas";

export const shop = new Hono<AppEnv>()
  .get("/items", async (c) => {
    try {
      const items = getShopItems();
      return c.json({ data: items }, 200);
    } catch (error) {
      logger.error(`[shop-api] GET /items error: ${error}`);
      return c.json(
        {
          error: {
            message: "内部サーバーエラーが発生しました",
            code: "INTERNAL_SERVER_ERROR",
          },
        },
        500,
      );
    }
  })
  .get("/inventory", async (c) => {
    try {
      const userId = c.get("authenticatedUserId");
      if (!userId) {
        return c.json(
          {
            error: {
              message: "認証されたユーザーIDが見つかりません",
              code: "MISSING_AUTHENTICATED_USER",
            },
          },
          401,
        );
      }

      const inventory = await getUserInventory(userId);
      return c.json({ data: inventory }, 200);
    } catch (error) {
      logger.error(`[shop-api] GET /inventory error: ${error}`);
      return c.json(
        {
          error: {
            message: "内部サーバーエラーが発生しました",
            code: "INTERNAL_SERVER_ERROR",
          },
        },
        500,
      );
    }
  })
  .post("/purchase", zValidator("json", purchaseItemSchema), async (c) => {
    try {
      const userId = c.get("authenticatedUserId");
      if (!userId) {
        return c.json(
          {
            error: {
              message: "認証されたユーザーIDが見つかりません",
              code: "MISSING_AUTHENTICATED_USER",
            },
          },
          401,
        );
      }

      const { itemId } = c.req.valid("json");
      const item = await purchaseItem(userId, itemId);

      return c.json({ data: item }, 200);
    } catch (error) {
      if (error instanceof ShopError) {
        const statusCode = getShopErrorStatusCode(error.code);
        return c.json(
          {
            error: {
              message: getShopErrorMessage(error.code),
              code: error.code,
            },
          },
          statusCode,
        );
      }

      logger.error(`[shop-api] POST /purchase error: ${error}`);
      return c.json(
        {
          error: {
            message: "内部サーバーエラーが発生しました",
            code: "INTERNAL_SERVER_ERROR",
          },
        },
        500,
      );
    }
  })
  .post("/use", zValidator("json", useItemSchema), async (c) => {
    try {
      const userId = c.get("authenticatedUserId");
      if (!userId) {
        return c.json(
          {
            error: {
              message: "認証されたユーザーIDが見つかりません",
              code: "MISSING_AUTHENTICATED_USER",
            },
          },
          401,
        );
      }

      const { userItemId } = c.req.valid("json");
      const result = await useItem(userId, userItemId);

      return c.json({ data: result }, 200);
    } catch (error) {
      if (error instanceof ItemEffectError) {
        const statusCode = getItemEffectErrorStatusCode(error.code);
        return c.json(
          {
            error: {
              message: getItemEffectErrorMessage(error.code),
              code: error.code,
            },
          },
          statusCode,
        );
      }

      logger.error(`[shop-api] POST /use error: ${error}`);
      return c.json(
        {
          error: {
            message: "内部サーバーエラーが発生しました",
            code: "INTERNAL_SERVER_ERROR",
          },
        },
        500,
      );
    }
  })
  .get("/history", async (c) => {
    try {
      const userId = c.get("authenticatedUserId");
      if (!userId) {
        return c.json(
          {
            error: {
              message: "認証されたユーザーIDが見つかりません",
              code: "MISSING_AUTHENTICATED_USER",
            },
          },
          401,
        );
      }

      const history = await getPurchaseHistory(userId);
      return c.json({ data: history }, 200);
    } catch (error) {
      logger.error(`[shop-api] GET /history error: ${error}`);
      return c.json(
        {
          error: {
            message: "内部サーバーエラーが発生しました",
            code: "INTERNAL_SERVER_ERROR",
          },
        },
        500,
      );
    }
  });

function getShopErrorStatusCode(code: string): 400 | 404 | 500 {
  switch (code) {
    case "ITEM_NOT_FOUND":
    case "USER_NOT_FOUND":
      return 404;
    case "ITEM_DISABLED":
    case "INSUFFICIENT_FUNDS":
    case "DAILY_LIMIT_EXCEEDED":
      return 400;
    default:
      return 500;
  }
}

function getShopErrorMessage(code: string): string {
  switch (code) {
    case "ITEM_NOT_FOUND":
      return "アイテムが見つかりません";
    case "USER_NOT_FOUND":
      return "ユーザーが見つかりません";
    case "ITEM_DISABLED":
      return "このアイテムは現在無効化されています";
    case "INSUFFICIENT_FUNDS":
      return "所持金が不足しています";
    case "DAILY_LIMIT_EXCEEDED":
      return "本日の購入制限に達しました";
    default:
      return "ショップエラーが発生しました";
  }
}

function getItemEffectErrorStatusCode(code: string): 400 | 403 | 404 | 500 {
  switch (code) {
    case "ITEM_NOT_FOUND":
      return 404;
    case "INVALID_USER":
      return 403;
    case "ALREADY_USED":
      return 400;
    default:
      return 500;
  }
}

function getItemEffectErrorMessage(code: string): string {
  switch (code) {
    case "ITEM_NOT_FOUND":
      return "対象のアイテムが見つかりません";
    case "INVALID_USER":
      return "このアイテムを所有していません";
    case "ALREADY_USED":
      return "このアイテムは既に使用されています";
    case "UNKNOWN_EFFECT":
      return "未定義のアイテム効果です";
    default:
      return "アイテム使用エラーが発生しました";
  }
}
