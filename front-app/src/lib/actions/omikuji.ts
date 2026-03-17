"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { createApiClient } from "@/lib/rpc-client";

export async function generateOmikujiAITextAction(omikujiId: string) {
  try {
    const session = await auth();
    const callerId = session?.user?.id || "";

    if (!callerId) {
      return { success: false, error: "Unauthorized" };
    }

    const client = await createApiClient(callerId);

    // We expect the backend API to handle the generation internally.
    const res = await client.api.minigame.omikuji["generate-text"][
      ":omikujiId"
    ].$post({
      param: { omikujiId },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        error: errorData.error?.message || "Failed to generate text",
      };
    }

    const { data } = await res.json();

    // Revalidate dashboard so it fetches the new Omikuji text
    revalidatePath("/dashboard");

    return { success: true, aiText: data.aiText };
  } catch (error) {
    if (error instanceof Error) {
      // Optional: could return specific error depending on usecase
    }
    return { success: false, error: "Internal server error" };
  }
}
