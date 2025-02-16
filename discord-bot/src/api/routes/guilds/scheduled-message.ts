import { addMessage, deleteMessage, editMessage } from "@handler/cron-handler";
import { prisma } from "@lib/prisma";
import type { ScheduledMessage } from "@prisma/client";
import cuid from "cuid";
import { Hono } from "hono";
import { z } from "zod";

export const message = new Hono();

message.get("/:id", async (c) => {
  const id = c.req.param("id");
  const query = (c.req.query("type") as "user" | "guild") ?? "guild";

  try {
    const data = await prisma.scheduledMessage.findMany({
      where: {
        [query === "user" ? "userId" : "guildId"]: id,
      },
      orderBy: {
        scheduleTime: "asc",
      },
    });

    return c.json(
      {
        status: "success",
        data,
      },
      200,
    );
  } catch (error) {
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
    const data = await prisma.scheduledMessage.findUnique({
      where: {
        id,
      },
    });
    return c.json(
      {
        status: "success",
        data,
      },
      200,
    );
  } catch (error) {
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

  const newMessage: ScheduledMessage = {
    id: cuid(),
    ...rest,
    createdUserId: userId,
    lastUpdatedUserId: userId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    await addMessage(newMessage);
    return c.json(
      {
        status: "success",
        data: {
          message: "メッセージのスケジュールに成功しました",
        },
      },
      200,
    );
  } catch (error) {
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

  try {
    const existingMessage = await prisma.scheduledMessage.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingMessage) {
      return c.json(
        {
          status: "error",
          error: {
            code: "NOT_FOUND",
            message: "指定されたメッセージが見つかりません",
          },
        },
        404,
      );
    }

    if (validatedData.guildId !== existingMessage.guildId) {
      return c.json(
        {
          status: "error",
          error: {
            code: "FORBIDDEN",
            message: "指定されたメッセージは存在しません",
          },
        },
        403,
      );
    }

    const updatedMessage: ScheduledMessage = {
      ...existingMessage,
      ...validatedData,
      lastUpdatedUserId:
        validatedData.userId || existingMessage.lastUpdatedUserId,
      updatedAt: new Date(),
    };

    await editMessage(updatedMessage);

    return c.json(
      {
        status: "success",
        data: {
          message: "メッセージの更新に成功しました",
        },
      },
      200,
    );
  } catch (error) {
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
  const messageId = body.messageId;
  const guildId = body.guildId;

  if (!messageId) {
    return c.json(
      {
        status: "error",
        error: {
          code: "INVALID_REQUEST",
          message: "メッセージIDが指定されていません",
        },
      },
      400,
    );
  }

  try {
    const existingMessage = await prisma.scheduledMessage.findUnique({
      where: { id: messageId },
    });

    if (!existingMessage) {
      return c.json(
        {
          status: "error",
          error: {
            code: "NOT_FOUND",
            message: "指定されたメッセージが見つかりません",
          },
        },
        404,
      );
    }

    if (existingMessage.guildId !== guildId) {
      return c.json(
        {
          status: "error",
          error: {
            code: "FORBIDDEN",
            message: "指定されたメッセージは存在しません",
          },
        },
        403,
      );
    }

    try {
      await deleteMessage(existingMessage);
    } catch {
      throw new Error("メッセージの削除に失敗しました");
    }

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
