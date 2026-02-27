"use server";

import { revalidatePath } from "next/cache";
import { createApiClient } from "@/lib/rpc-client";

type ActionState = {
  error?: { code: string; message: string };
  data?: { message: string; scheduledMessage: unknown };
} | null;

export async function createSchedule(
  _prevState: ActionState,
  formData: FormData,
) {
  try {
    const client = await createApiClient();
    const res = await client.api.guilds.scheduledmessage.$post({
      json: {
        data: {
          channelId: formData.get("channelId") as string,
          message: formData.get("message") as string,
          scheduleTime: formData.get("scheduleTime") as string,
          guildId: formData.get("guildId") as string,
          userId: formData.get("userId") as string,
        },
      },
    });

    const data = await res.json();
    if (!res.ok) {
      const errorData = data as { error: { message: string } };
      // biome-ignore lint/suspicious/noConsole: <エラーをコンソールに出力するため>
      console.error(data);
      throw new Error(errorData.error.message);
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
    const client = await createApiClient();
    const res = await client.api.guilds.scheduledmessage.$patch({
      json: {
        data: {
          id: formData.get("id") as string,
          channelId: (formData.get("channelId") as string) || undefined,
          message: (formData.get("message") as string) || undefined,
          scheduleTime: (formData.get("scheduleTime") as string) || undefined,
          guildId: formData.get("guildId") as string,
          userId: formData.get("userId") as string,
          isActive: formData.get("isActive") === "true",
        },
      },
    });

    const data = await res.json();
    if (!res.ok) {
      const errorData = data as {
        error: { message: string; details?: unknown };
      };
      // biome-ignore lint/suspicious/noConsole: <エラーをコンソールに出力するため>
      console.error(data, errorData.error.details);
      throw new Error(errorData.error.message);
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
