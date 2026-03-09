"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createApiClient } from "@/lib/rpc-client";

const createSchema = z.object({
  channelId: z.string().min(1),
  message: z.string().min(1).max(200),
  scheduleTime: z.string().regex(/^([0-9]{1,2}:[0-9]{2})$/),
  guildId: z.string().min(1),
  userId: z.string().min(1),
});

const updateSchema = z.object({
  id: z.string().min(1),
  channelId: z.string().optional(),
  message: z.string().optional(),
  scheduleTime: z.string().optional(),
  guildId: z.string().min(1),
  userId: z.string().min(1),
  isActive: z.boolean().optional(),
});

export async function createJihou(data: {
  channelId: string;
  message: string;
  scheduleTime: string;
  guildId: string;
  userId: string;
}) {
  const parsed = createSchema.safeParse(data);
  if (!parsed.success) {
    return {
      error: { code: "VALIDATION_ERROR", message: "入力内容に不備があります" },
    };
  }

  try {
    const client = await createApiClient();
    const res = await client.api.guilds.scheduledmessage.$post({
      json: { data: parsed.data },
    });
    const result = await res.json();
    if (!res.ok && "error" in result) {
      return { error: { code: "API_ERROR", message: result.error.message } };
    }
    revalidatePath(`/channels/${data.guildId}/${data.channelId}`);
    return result;
  } catch (error) {
    return {
      error: {
        code: "ERROR",
        message:
          error instanceof Error ? error.message : "エラーが発生しました",
      },
    };
  }
}

export async function updateJihou(data: {
  id: string;
  channelId?: string;
  message?: string;
  scheduleTime?: string;
  guildId: string;
  userId: string;
  isActive?: boolean;
}) {
  const parsed = updateSchema.safeParse(data);
  if (!parsed.success) {
    return {
      error: { code: "VALIDATION_ERROR", message: "入力内容に不備があります" },
    };
  }

  try {
    const client = await createApiClient();
    const res = await client.api.guilds.scheduledmessage.$patch({
      json: { data: parsed.data },
    });
    const result = await res.json();
    if (!res.ok && "error" in result) {
      return { error: { code: "API_ERROR", message: result.error.message } };
    }
    revalidatePath(`/channels/${data.guildId}/${data.channelId}`);
    return result;
  } catch (error) {
    return {
      error: {
        code: "ERROR",
        message:
          error instanceof Error ? error.message : "エラーが発生しました",
      },
    };
  }
}

export async function deleteJihou(
  messageId: string,
  guildId: string,
  channelId: string,
) {
  try {
    const client = await createApiClient();
    const res = await client.api.guilds.scheduledmessage.$delete({
      json: { id: messageId, guildId },
    });
    const result = await res.json();
    revalidatePath(`/channels/${guildId}/${channelId}`);
    return result;
  } catch (error) {
    return {
      error: {
        code: "ERROR",
        message:
          error instanceof Error ? error.message : "エラーが発生しました",
      },
    };
  }
}

export async function toggleJihouActive(data: {
  id: string;
  guildId: string;
  userId: string;
  channelId: string;
  isActive: boolean;
}) {
  return updateJihou({
    id: data.id,
    guildId: data.guildId,
    userId: data.userId,
    isActive: data.isActive,
  });
}
