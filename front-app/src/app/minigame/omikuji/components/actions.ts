"use server";

export const drawOmikuji = async (userId: string) => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/minigame/omikuji/draw`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.API_KEY as string,
      },
      body: JSON.stringify({ userId }),
    },
  );
  return result.json();
};
