"use server";

import { authenticatedFetch } from "@/lib/auth-api";

export const drawOmikuji = async (userId: string) => {
  // userIdはJWTトークンから自動取得されるため、パラメータとして送信しない
  const result = await authenticatedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/minigame/omikuji/draw`,
    {
      method: "POST",
      body: JSON.stringify({}), // 空のボディ
    },
  );
  return result.json();
};
