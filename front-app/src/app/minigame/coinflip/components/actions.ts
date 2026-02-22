"use server";

import { authenticatedFetch } from "@/lib/auth-api";

export const flipCoin = async (
  userId: string,
  bet: number,
  choice: "heads" | "tails",
) => {
  // userIdはJWTトークンから自動取得されるため、パラメータから除去
  const response = await authenticatedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/minigame/coinflip/play`,
    {
      method: "POST",
      body: JSON.stringify({
        bet,
        choice,
      }),
    },
  );
  return response.json();
};
