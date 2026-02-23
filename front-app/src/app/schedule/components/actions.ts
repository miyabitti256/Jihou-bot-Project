"use server";

import { authenticatedFetch } from "@/lib/auth-api";

export const messageDelete = async (messageId: string, guildId: string) => {
  const response = await authenticatedFetch(
    `${process.env.API_URL}/api/guilds/scheduledmessage`,
    {
      method: "DELETE",
      body: JSON.stringify({ id: messageId, guildId }),
    },
  );

  return await response.json();
};
