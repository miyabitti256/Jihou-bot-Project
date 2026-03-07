"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createApiClient } from "@/lib/rpc-client";

const createScheduleSchema = z.object({
  channelId: z.string().min(1),
  message: z.string().min(1),
  scheduleTime: z.string().min(1),
  guildId: z.string().min(1),
  userId: z.string().min(1),
});

const updateScheduleSchema = z.object({
  id: z.string().min(1),
  channelId: z.string().optional(),
  message: z.string().optional(),
  scheduleTime: z.string().optional(),
  guildId: z.string().min(1),
  userId: z.string().min(1),
  isActive: z.string().optional(),
});

type ActionState = {
  error?: { code: string; message: string };
  data?: { message: string; scheduledMessage: unknown };
} | null;

export async function createSchedule(
  _prevState: ActionState,
  formData: FormData,
) {
  try {
    const parsed = createScheduleSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );

    if (!parsed.success) {
      return {
        error: {
          code: "VALIDATION_ERROR",
          message: "入力内容に不備があります",
        },
      };
    }

    const client = await createApiClient();
    const res = await client.api.guilds.scheduledmessage.$post({
      json: {
        data: parsed.data,
      },
    });

    const data = await res.json();
    if (!res.ok && "error" in data) {
      // biome-ignore lint/suspicious/noConsole: <エラーをコンソールに出力するため>
      console.error(data);
      throw new Error(data.error.message);
    }

    revalidatePath("/schedule");
    return data;
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

export async function updateSchedule(
  _prevState: ActionState,
  formData: FormData,
) {
  try {
    const parsed = updateScheduleSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );

    if (!parsed.success) {
      return {
        error: {
          code: "VALIDATION_ERROR",
          message: "入力内容に不備があります",
        },
      };
    }

    const { isActive: isActiveStr, ...rest } = parsed.data;

    const client = await createApiClient();
    const res = await client.api.guilds.scheduledmessage.$patch({
      json: {
        data: {
          ...rest,
          channelId: rest.channelId || undefined,
          message: rest.message || undefined,
          scheduleTime: rest.scheduleTime || undefined,
          isActive: isActiveStr === "true",
        },
      },
    });

    const data = await res.json();
    if (!res.ok && "error" in data) {
      // biome-ignore lint/suspicious/noConsole: <エラーをコンソールに出力するため>
      console.error(data);
      throw new Error(data.error.message);
    }

    revalidatePath("/schedule");
    return data;
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
