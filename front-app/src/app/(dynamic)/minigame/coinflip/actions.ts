"use server";

import { createApiClient } from "@/lib/rpc-client";

export const flipCoin = async (bet: number, choice: "heads" | "tails") => {
  const client = await createApiClient();
  const res = await client.api.minigame.coinflip.play.$post({
    json: { bet, choice },
  });
  return res.json();
};
