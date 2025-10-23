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
import { Hono } from "hono";
import { z } from "zod";

export const message = new Hono();

message.get("/all", async (c) => {
  try {
    const data = await getAllScheduledMessages();

    return c.json(
      {
        status: "success",
        data,
      },
      200,
    );
  } catch (error) {
    logger.error(`[scheduledmessage-api] Error getting all messages: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "INTERNALSERVERERROR",
          message: "Internal server error",
          details: error,
        },
      },
      500,
    );
  }
});

message.get("/:id", async (c) => {
  const id = c.req.param("id");
  const query = (c.req.query("type") as "user" | "guild") ?? "guild";

  try {
    const data = await getScheduledMessages(id, query);

    return c.json(
      {
        status: "success",
        data,
      },
      200,
    );
  } catch (error) {
    logger.error(`[scheduledmessage-api] Error getting messages: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "INTERNALSERVERERROR",
          message: "Internal server error",
          details: error,
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
    return c.json(
      {
        status: "success",
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
          status: "error",
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
        status: "error",
        error: {
          code: "INTERNALSERVERERROR",
          message: "Internal server error",
          details: error,
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
    scheduleTime: z.string().regex(/^([0-9]{1,2}:[0-9]{2})$/),
    guildId: z.string().min(1),
    userId: z.string().min(1),
  });

  const result = scheduledMessageSchema.safeParse(body.data);

  if (!result.success) {
    return c.json(
      {
        status: "error",
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
  const { userId, ...rest } = validatedData;

  const createData: ScheduledMessageCreateData = {
    ...rest,
    createdUserId: userId,
  };

  try {
    const createdMessage = await createScheduledMessage(createData);

    return c.json(
      {
        status: "success",
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
            status: "error",
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
        status: "error",
        error: {
          code: "INTERNALSERVERERROR",
          message: "Internal server error",
          details: error,
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
      .regex(/^([0-9]{1,2}:[0-9]{2})$/)
      .optional(),
    guildId: z.string().min(1),
    userId: z.string().min(1),
    isActive: z.boolean().optional(),
  });

  const result = patchSchema.safeParse(body.data);

  if (!result.success) {
    return c.json(
      {
        status: "error",
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
        status: "success",
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
            status: "error",
            error: {
              code: "NOTFOUND",
              message: "指定されたメッセージが見つかりません",
            },
          },
          404,
        );
      }

      if (error.message === "INVALID_TIME_FORMAT") {
        return c.json(
          {
            status: "error",
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
        status: "error",
        error: {
          code: "INTERNALSERVERERROR",
          message: "Internal server error",
          details: error,
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
        status: "error",
        error: {
          code: "VALIDATION_ERROR",
          message: "入力データが不正です",
          details: result.error.format(),
        },
      },
      400,
    );
  }

  const { id } = result.data;

  try {
    await deleteScheduledMessage(id);

    return c.json(
      {
        status: "success",
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
          status: "error",
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
        status: "error",
        error: {
          code: "INTERNALSERVERERROR",
          message: "Internal server error",
          details: error,
        },
      },
      500,
    );
  }
});
