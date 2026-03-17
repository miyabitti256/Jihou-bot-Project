import { logger } from "@bot/lib/logger";
import {
  drawOmikuji,
  generateOmikujiAIText,
  getOmikujiHistory,
  OmikujiError,
} from "@bot/services/minigame/omikuji";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AppEnv } from "../../env";
import { omikujiResultQuerySchema, userIdParamSchema } from "../../schemas";

// おみくじの履歴を取得するAPI
// おみくじを引くAPI
export const omikuji = new Hono<AppEnv>()
  .get(
    "/result/:userId",
    zValidator("param", userIdParamSchema),
    zValidator("query", omikujiResultQuerySchema),
    async (c) => {
      const { userId } = c.req.valid("param");
      const { take } = c.req.valid("query");
      const authenticatedUserId = c.get("authenticatedUserId");

      if (userId !== authenticatedUserId) {
        return c.json(
          {
            error: {
              code: "FORBIDDEN",
              message: "Forbidden - Insufficient permissions",
            },
          },
          403,
        );
      }

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
    },
  )
  .post("/draw", async (c) => {
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
        const statusCode = getOmikujiStatusCode(error.message);

        return c.json(
          {
            error: {
              message: getOmikujiErrorMessage(error.message),
              code: error.message,
            },
          },
          statusCode,
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
  })
  .post("/generate-text/:omikujiId", async (c) => {
    const userId = c.get("authenticatedUserId");
    const omikujiId = c.req.param("omikujiId");

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
      const aiText = await generateOmikujiAIText(omikujiId, userId);

      return c.json(
        {
          data: { aiText },
        },
        200,
      );
    } catch (error) {
      if (error instanceof OmikujiError) {
        return c.json(
          {
            error: {
              message: getOmikujiErrorMessage(error.message),
              code: error.message,
            },
          },
          getOmikujiStatusCode(error.message),
        );
      }

      logger.error(`[omikuji-api] AI解説生成エラー: ${error}`);
      return c.json(
        {
          error: {
            message: "AI解説の生成に失敗しました",
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
    case "OMIKUJI_NOT_FOUND":
      return "おみくじ結果が見つかりません";
    case "AI_GENERATION_FAILED":
      return "AI解説の生成に失敗しました";
    default:
      return "おみくじの処理に失敗しました";
  }
}

// エラーコードに応じたHTTPステータスコードを取得する関数
function getOmikujiStatusCode(errorCode: string): 400 | 404 | 500 {
  switch (errorCode) {
    case "USER_NOT_FOUND":
      return 404;
    case "ALREADY_DRAWN":
      return 400;
    case "OMIKUJI_NOT_FOUND":
      return 404;
    case "AI_GENERATION_FAILED":
      return 500;
    default:
      return 500;
  }
}
