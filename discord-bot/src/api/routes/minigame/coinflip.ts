import { zValidator } from "@hono/zod-validator";
import { logger } from "@lib/logger";
import {
  CoinflipError,
  getCoinflipHistory,
  getUserMoneyStatus,
  playCoinflip,
} from "@services/minigame/coinflip";
import { Hono } from "hono";
import type { AppEnv } from "../../env";
import {
  coinflipHistoryQuerySchema,
  coinflipPlaySchema,
  userIdParamSchema,
} from "../../schemas";

// コインフリップをプレイするAPI
// ユーザーの所持金情報を取得するAPI
// コインフリップの履歴を取得するAPI
export const coinflip = new Hono<AppEnv>()
  .post("/play", zValidator("json", coinflipPlaySchema), async (c) => {
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

      const { bet, choice } = c.req.valid("json");
      const result = await playCoinflip(userId, bet, choice);

      return c.json(
        {
          data: result,
        },
        200,
      );
    } catch (error) {
      if (error instanceof CoinflipError) {
        const statusCode = getErrorStatusCode(error.message);

        return c.json(
          {
            error: {
              message: getErrorMessage(error.message),
              code: error.message,
            },
          },
          statusCode,
        );
      }

      logger.error(`[coinflip-api] コインフリップエラー: ${error}`);
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
  .get("/status/:userId", zValidator("param", userIdParamSchema), async (c) => {
    const { userId } = c.req.valid("param");

    try {
      const money = await getUserMoneyStatus(userId);

      return c.json(
        {
          data: {
            money,
          },
        },
        200,
      );
    } catch (error) {
      logger.error(`[coinflip-api] 所持金取得エラー: ${error}`);
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
  .get(
    "/history/:userId",
    zValidator("param", userIdParamSchema),
    zValidator("query", coinflipHistoryQuerySchema),
    async (c) => {
      const { userId } = c.req.valid("param");
      const { take } = c.req.valid("query");

      try {
        const history = await getCoinflipHistory(userId, take);

        return c.json(
          {
            data: history,
          },
          200,
        );
      } catch (error) {
        logger.error(`[coinflip-api] 履歴取得エラー: ${error}`);
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
    },
  );

// エラーメッセージを取得する関数
function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "MONEY_DATA_NOT_FOUND":
      return "所持金データが見つかりません";
    case "NO_MONEY":
      return "所持金が0円です";
    case "INVALID_BET":
      return "賭け金は1円以上である必要があります";
    case "INVALID_BET_AMOUNT":
      return "賭け金が上限を超えています";
    default:
      return "エラーが発生しました";
  }
}

// エラーコードに応じたHTTPステータスコードを取得する関数
function getErrorStatusCode(errorCode: string): 400 | 404 | 500 {
  switch (errorCode) {
    case "MONEY_DATA_NOT_FOUND":
      return 404;
    case "NO_MONEY":
    case "INVALID_BET":
    case "INVALID_BET_AMOUNT":
      return 400;
    default:
      return 500;
  }
}
