"use server";

import { revalidatePath } from "next/cache";

export async function createSchedule(
  prevState: { message?: string; error?: string } | null,
  formData: FormData,
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/guilds/scheduledmessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.API_KEY as string,
        },
        body: JSON.stringify({ data: Object.fromEntries(formData) }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      console.error(data);
      throw new Error(data.error.message);
    }

    revalidatePath("/schedule");
    return data;
  } catch (error) {
    return {
      error: {
        message:
          error instanceof Error ? error.message : "エラーが発生しました",
      },
    };
  }
}

export async function updateSchedule(
  prevState: { message?: string; error?: string } | null,
  formData: FormData,
) {
  try {
    const updateData = {
      id: formData.get("id"),
      channelId: formData.get("channelId"),
      message: formData.get("message"),
      scheduleTime: formData.get("scheduleTime"),
      guildId: formData.get("guildId"),
      userId: formData.get("userId"),
      isActive: formData.get("isActive") === "true",
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/guilds/scheduledmessage`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.API_KEY as string,
        },
        body: JSON.stringify({ data: updateData }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      console.error(data, data.error.details);
      throw new Error(data.error.message);
    }

    revalidatePath("/schedule");
    return data;
  } catch (error) {
    return {
      error: {
        message:
          error instanceof Error ? error.message : "エラーが発生しました",
      },
    };
  }
}
