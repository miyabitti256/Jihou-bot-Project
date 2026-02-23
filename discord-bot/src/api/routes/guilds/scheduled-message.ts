import { logger } from "@lib/logger";
import {
  createScheduledMessage,
  deleteScheduledMessage,
  getAllScheduledMessages,
  getScheduledMessageById,
  getScheduledMessages,
  type ScheduledMessageCreateData,
  ScheduledMessageError,
  type ScheduledMessageUpdateData,
  updateScheduledMessage,
} from "@services/guilds/scheduled-message";
import {
  getUserGuilds,
  verifyUserGuildAccess,
} from "@services/guilds/guild";
import { Hono } from "hono";
import { z } from "zod";

export const message = new Hono();

message.get("/all", async (c) => {
  try {
    const authenticatedUserId = c.get("authenticatedUserId");
    if (!authenticatedUserId) {
      return c.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        401,
      );
    }

    // ユーザーが所属するギルドのメッセージのみ返す
    const userGuilds = await getUserGuilds(authenticatedUserId);
    const guildIds = userGuilds.map((g) => g.guildId);

    const allMessages = await getAllScheduledMessages();
    const data = allMessages.filter((msg) => guildIds.includes(msg.guildId));

    return c.json(
      {
        data,
      },
      200,
    );
  } catch (error) {
    logger.error(`[scheduledmessage-api] Error getting all messages: ${error}`);
    return c.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          details:
            process.env.NODE_ENV === "development" ? String(error) : null,
        },
      },
      500,
    );
  }
});

message.get("/:id", async (c) => {
  const id = c.req.param("id");
  const query = (c.req.query("type") as "user" | "guild") ?? "guild";

  const authenticatedUserId = c.get("authenticatedUserId");
  if (!authenticatedUserId) {
    return c.json(
      { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
      401,
    );
  }

  // ギルド照会時はギルドへのアクセス権を検証
  if (query === "guild") {
    const hasAccess = await verifyUserGuildAccess(authenticatedUserId, id);
    if (!hasAccess) {
      return c.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Forbidden - Insufficient permissions for this guild",
          },
        },
        403,
      );
    }
  } else {
    // ユーザー照会時は自分のIDのみ許可
    if (id !== authenticatedUserId) {
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
  }

  try {
    const data = await getScheduledMessages(id, query);

    return c.json(
      {
        data,
      },
      200,
    );
  } catch (error) {
    logger.error(`[scheduledmessage-api] Error getting messages: ${error}`);
    return c.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          details:
            process.env.NODE_ENV === "development" ? String(error) : null,
        },
      },
      500,
    );
  }
});

message.get("/details/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const data = await getScheduledMessageById(id);

    // メッセージのギルドへのアクセス権を検証
    const authenticatedUserId = c.get("authenticatedUserId");
    if (authenticatedUserId) {
      const hasAccess = await verifyUserGuildAccess(
        authenticatedUserId,
        data.guildId,
      );
      if (!hasAccess) {
        return c.json(
          {
            error: {
              code: "FORBIDDEN",
              message:
                "Forbidden - Insufficient permissions for this guild",
            },
          },
          403,
        );
      }
    }

    return c.json(
      {
        data,
      },
      200,
    );
  } catch (error) {
    if (
      error instanceof ScheduledMessageError &&
      error.message === "MESSAGE_NOT_FOUND"
    ) {
      return c.json(
        {
          error: {
            code: "NOTFOUND",
            message: "Scheduled message not found",
          },
        },
        404,
      );
    }

    logger.error(
      `[scheduledmessage-api] Error getting message details: ${error}`,
    );
    return c.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          details:
            process.env.NODE_ENV === "development" ? String(error) : null,
        },
      },
      500,
    );
  }
});

message.post("/", async (c) => {
  const body = await c.req.json();
  const scheduledMessageSchema = z.object({
    channelId: z.string().min(1),
    message: z.string().min(1).max(200),
    scheduleTime: z.string().regex(/^([01]?\d|2[0-3]):([0-5]\d)$/),
    guildId: z.string().min(1),
    userId: z.string().min(1),
  });

  const result = scheduledMessageSchema.safeParse(body.data);

  if (!result.success) {
    return c.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "入力データが不正です",
          details: result.error.format(),
        },
      },
      400,
    );
  }

  const validatedData = result.data;
  const { userId, guildId, ...rest } = validatedData;

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

  const hasAccess = await verifyUserGuildAccess(authenticatedUserId, guildId);
  if (!hasAccess) {
    return c.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Forbidden - Insufficient permissions for this guild",
        },
      },
      403,
    );
  }

  const createData: ScheduledMessageCreateData = {
    ...rest,
    guildId,
    createdUserId: userId,
  };

  try {
    const createdMessage = await createScheduledMessage(createData);

    return c.json(
      {
        data: {
          message: "メッセージのスケジュールに成功しました",
          scheduledMessage: createdMessage,
        },
      },
      200,
    );
  } catch (error) {
    if (error instanceof ScheduledMessageError) {
      if (error.message === "INVALID_TIME_FORMAT") {
        return c.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "時刻のフォーマットが不正です",
            },
          },
          400,
        );
      }
    }

    logger.error(`[scheduledmessage-api] Error creating message: ${error}`);
    return c.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          details:
            process.env.NODE_ENV === "development" ? String(error) : null,
        },
      },
      500,
    );
  }
});

message.patch("/", async (c) => {
  const body = await c.req.json();

  const patchSchema = z.object({
    id: z.string().min(1),
    channelId: z.string().min(1).optional(),
    message: z.string().min(1).max(200).optional(),
    scheduleTime: z
      .string()
      .regex(/^([01]?\d|2[0-3]):([0-5]\d)$/)
      .optional(),
    guildId: z.string().min(1),
    userId: z.string().min(1),
    isActive: z.boolean().optional(),
  });

  const result = patchSchema.safeParse(body.data);

  if (!result.success) {
    return c.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "入力データが不正です",
          details: result.error.format(),
        },
      },
      400,
    );
  }

  const validatedData = result.data;
  const { id, guildId, userId, ...rest } = validatedData;

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

  const hasAccess = await verifyUserGuildAccess(authenticatedUserId, guildId);
  if (!hasAccess) {
    return c.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Forbidden - Insufficient permissions for this guild",
        },
      },
      403,
    );
  }

  const updateData: ScheduledMessageUpdateData = {
    id,
    guildId,
    lastUpdatedUserId: userId,
    ...rest,
  };

  try {
    const updatedMessage = await updateScheduledMessage(updateData);

    return c.json(
      {
        data: {
          message: "メッセージの更新に成功しました",
          scheduledMessage: updatedMessage,
        },
      },
      200,
    );
  } catch (error) {
    if (error instanceof ScheduledMessageError) {
      if (error.message === "MESSAGE_NOT_FOUND") {
        return c.json(
          {
            error: {
              code: "NOT_FOUND",
              message: "指定されたメッセージが見つかりません",
            },
          },
          404,
        );
      }

      if (error.message === "INVALID_TIME_FORMAT") {
        return c.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "時刻のフォーマットが不正です",
            },
          },
          400,
        );
      }
    }

    logger.error(`[scheduledmessage-api] Error updating message: ${error}`);
    return c.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          details:
            process.env.NODE_ENV === "development" ? String(error) : null,
        },
      },
      500,
    );
  }
});

message.delete("/", async (c) => {
  const body = await c.req.json();

  const deleteSchema = z.object({
    id: z.string().min(1),
    guildId: z.string().min(1),
  });

  const result = deleteSchema.safeParse(body);

  if (!result.success) {
    return c.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "入力データが不正です",
          details: result.error.format(),
        },
      },
      400,
    );
  }

  const { id, guildId } = result.data;
  const authenticatedUserId = c.get("authenticatedUserId");

  const hasAccess = await verifyUserGuildAccess(authenticatedUserId, guildId);
  if (!hasAccess) {
    return c.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Forbidden - Insufficient permissions for this guild",
        },
      },
      403,
    );
  }

  try {
    await deleteScheduledMessage(id);

    return c.json(
      {
        data: {
          message: "メッセージの削除に成功しました",
        },
      },
      200,
    );
  } catch (error) {
    if (
      error instanceof ScheduledMessageError &&
      error.message === "MESSAGE_NOT_FOUND"
    ) {
      return c.json(
        {
          error: {
            code: "NOTFOUND",
            message: "指定されたメッセージが見つかりません",
          },
        },
        404,
      );
    }

    logger.error(`[scheduledmessage-api] Error deleting message: ${error}`);
    return c.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          details:
            process.env.NODE_ENV === "development" ? String(error) : null,
        },
      },
      500,
    );
  }
});
