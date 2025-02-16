"use server";

export const flipCoin = async (
  userId: string,
  bet: number,
  choice: "heads" | "tails",
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/minigame/coinflip/play`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.API_KEY as string,
      },
      body: JSON.stringify({
        userId,
        bet,
        choice,
      }),
    },
  );
  return response.json();
};
