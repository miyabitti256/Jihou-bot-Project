import { Hono } from "hono";
import { verify } from "hono/jwt";
import { logger } from "@lib/logger";
import { generateSecureJWT } from "@lib/auth-middleware";

const auth = new Hono();

// JWTトークン生成エンドポイント
auth.post("/token", async (c) => {
  try {
    const { userId } = await c.req.json();
    
    if (!userId) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALID_REQUEST",
            message: "User ID is required",
            details: null,
          },
        },
        400,
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error("JWT_SECRET environment variable is not set");
      return c.json(
        {
          status: "error",
          error: {
            code: "INTERNAL_ERROR",
            message: "Server configuration error",
            details: null,
          },
        },
        500,
      );
    }

    // Discord User IDの形式検証（数値文字列）
    if (!/^\d+$/.test(userId)) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALID_USER_ID",
            message: "Invalid Discord User ID format",
            details: null,
          },
        },
        400,
      );
    }

    // セキュアなJWT生成
    const token = await generateSecureJWT(userId, jwtSecret);

    logger.info(`JWT token generated for user: ${userId}`);

    return c.json({
      status: "success",
      data: {
        token,
        expiresIn: 24 * 60 * 60, // 秒単位
      },
    });
  } catch (error) {
    logger.error(`JWT token generation failed: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "TOKEN_GENERATION_FAILED",
          message: "Failed to generate token",
          details: null,
        },
      },
      500,
    );
  }
});

// JWTトークン検証エンドポイント（デバッグ用）
auth.post("/verify", async (c) => {
  try {
    const { token } = await c.req.json();
    
    if (!token) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALID_REQUEST",
            message: "Token is required",
            details: null,
          },
        },
        400,
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INTERNAL_ERROR",
            message: "Server configuration error",
            details: null,
          },
        },
        500,
      );
    }

    const payload = await verify(token, jwtSecret);

    return c.json({
      status: "success",
      data: {
        valid: true,
        payload,
      },
    });
  } catch (error) {
    logger.info(`JWT token verification failed: ${error}`);
    return c.json({
      status: "success",
      data: {
        valid: false,
        error: "Invalid or expired token",
      },
    });
  }
});

export { auth }; 