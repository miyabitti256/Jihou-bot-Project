"use server";

import { createApiClient } from "@/lib/rpc-client";

export const drawOmikuji = async () => {
  const client = await createApiClient();
  const res = await client.api.minigame.omikuji.draw.$post();
  return res.json();
};
