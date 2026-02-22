import { logger } from "@lib/logger";
import {
  CoinflipError,
  getCoinflipHistory,
  getUserMoneyStatus,
  playCoinflip,
} from "@services/minigame/coinflip";
import { Hono } from "hono";

export const coinflip = new Hono();

// コインフリップをプレイするAPI
coinflip.post("/play", async (c) => {
  try {
    // JWTペイロードから認証済みユーザーIDを取得
    const userId = c.get("authenticatedUserId");
    const { bet, choice } = await c.req.json();

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

    if (bet === undefined || !choice) {
      return c.json(
        {

          error: {
            message: "必須パラメータが不足しています（bet, choice）",
            code: "MISSING_PARAMETERS",
          },
        },
        400,
      );
    }

    // 有効なコイン選択肢かチェック
    if (choice !== "heads" && choice !== "tails") {
      return c.json(
        {

          error: {
            message: "コインの選択は 'heads' か 'tails' である必要があります",
            code: "INVALID_CHOICE",
          },
        },
        400,
      );
    }

    const result = await playCoinflip(userId, Number(bet), choice);

    return c.json({

      data: result,
    });
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
        statusCode as 400 | 404 | 500,
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
});

// ユーザーの所持金情報を取得するAPI
coinflip.get("/status/:userId", async (c) => {
  const userId = c.req.param("userId");
  if (!userId) {
    return c.json(
      {

        error: {
          message: "ユーザーIDが指定されていません",
          code: "USER_ID_NOT_PROVIDED",
        },
      },
      400,
    );
  }

  try {
    const money = await getUserMoneyStatus(userId);

    return c.json({

      data: {
        money,
      },
    });
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
});

// コインフリップの履歴を取得するAPI
coinflip.get("/history/:userId", async (c) => {
  const userId = c.req.param("userId");
  const takeQuery = c.req.query("take");
  const take = takeQuery ? Number.parseInt(takeQuery) : 100;

  try {
    const history = await getCoinflipHistory(userId, take);

    return c.json({

      data: history,
    });
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
});

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
function getErrorStatusCode(errorCode: string): number {
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
