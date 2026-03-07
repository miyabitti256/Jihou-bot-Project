"use server";

import { createApiClient } from "@/lib/rpc-client";

export const messageDelete = async (messageId: string, guildId: string) => {
  const client = await createApiClient();
  const res = await client.api.guilds.scheduledmessage.$delete({
    json: { id: messageId, guildId },
  });
  return await res.json();
};
