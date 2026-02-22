import { logger } from "@lib/logger";
import {
  drawOmikuji,
  getOmikujiHistory,
  OmikujiError,
} from "@services/minigame/omikuji";
import { Hono } from "hono";

export const omikuji = new Hono();

// おみくじの履歴を取得するAPI
omikuji.get("/result/:userId", async (c) => {
  const userId = c.req.param("userId");
  const takeQuery = c.req.query("take");
  const take = takeQuery ? Number.parseInt(takeQuery) : 10;

  try {
    const data = await getOmikujiHistory(userId, take);

    return c.json(
      {

        data,
      },
      200,
    );
  } catch (error) {
    logger.error(`[omikuji-api] おみくじ履歴取得エラー: ${error}`);
    return c.json(
      {

        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "内部サーバーエラーが発生しました",
        },
      },
      500,
    );
  }
});

// おみくじを引くAPI
omikuji.post("/draw", async (c) => {
  // JWTペイロードから認証済みユーザーIDを取得
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

  try {
    const result = await drawOmikuji(userId);

    return c.json(
      {

        data: result,
      },
      200,
    );
  } catch (error) {
    if (error instanceof OmikujiError) {
      // エラーコードに基づいて適切なステータスコードを設定
      let statusCode = 500;
      if (error.message === "USER_NOT_FOUND") {
        statusCode = 404;
      } else if (error.message === "ALREADY_DRAWN") {
        statusCode = 400;
      }

      return c.json(
        {

          error: {
            message: getOmikujiErrorMessage(error.message),
            code: error.message,
          },
        },
        statusCode as 400 | 404 | 500,
      );
    }

    logger.error(`[omikuji-api] おみくじ処理エラー: ${error}`);
    return c.json(
      {

        error: {
          message: "おみくじの処理に失敗しました",
          code: "INTERNAL_SERVER_ERROR",
        },
      },
      500,
    );
  }
});

// エラーメッセージを取得する関数
function getOmikujiErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "USER_NOT_FOUND":
      return "ユーザーが見つかりません";
    case "ALREADY_DRAWN":
      return "おみくじは一日に一度しか引けません";
    default:
      return "おみくじの処理に失敗しました";
  }
}
