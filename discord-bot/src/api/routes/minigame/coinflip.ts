import { Hono } from "hono";
import { prisma } from "@/lib/prisma";

export const coinflip = new Hono();

coinflip.post("/play", async (c) => {
  try {
    const { userId, bet, choice } = await c.req.json();

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { money: true },
    });

    if (!user) {
      return c.json(
        {
          status: "error",
          error: {
            message: "所持金データが見つかりません",
            code: "MONEY_DATA_NOT_FOUND",
            detail: null,
          },
        },
        404,
      );
    }

    if (user.money <= 0) {
      return c.json(
        {
          status: "error",
          error: {
            message: "所持金が0円です",
            code: "NO_MONEY",
            detail: null,
          },
        },
        400,
      );
    }

    if (bet < 1) {
      return c.json(
        {
          status: "error",
          error: {
            message: "賭け金は1円以上である必要があります",
            code: "INVALID_BET",
            detail: null,
          },
        },
        400,
      );
    }

    const maxBet = Math.min(user.money, 10000);
    if (bet > maxBet) {
      return c.json(
        {
          status: "error",
          error: {
            message: `無効な金額です。1～${maxBet}円の間で指定してください`,
            code: "INVALID_BET_AMOUNT",
            detail: { maxBet },
          },
        },
        400,
      );
    }

    const result = Math.random() >= 0.5 ? "heads" : "tails";
    const win = choice === result;
    const resultMoney = win ? bet : -bet;

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { money: user.money + resultMoney },
    });

    await prisma.coinFlip.create({
      data: {
        userId,
        bet,
        win,
        updatedMoney: updatedUser.money,
      },
    });

    return c.json({
      status: "success",
      data: {
        win,
        coinResult: result,
        bet,
        updatedMoney: updatedUser.money,
        moneyChange: resultMoney,
      },
    });
  } catch (error) {
    return c.json(
      {
        status: "error",
        error: {
          message: "内部サーバーエラーが発生しました",
          code: "INTERNAL_SERVER_ERROR",
          detail: error,
        },
      },
      500,
    );
  }
});

coinflip.get("/status/:userId", async (c) => {
  const userId = c.req.param("userId");
  if (!userId) {
    return c.json(
      {
        status: "error",
        error: {
          message: "ユーザーIDが指定されていません",
          code: "USER_ID_NOT_PROVIDED",
          detail: null,
        },
      },
      400,
    );
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { money: true },
    });

    return c.json({
      status: "success",
      data: {
        money: user?.money || 0,
      },
    });
  } catch (error) {
    return c.json(
      {
        status: "error",
        error: {
          message: "内部サーバーエラーが発生しました",
          code: "INTERNAL_SERVER_ERROR",
          detail: error,
        },
      },
      500,
    );
  }
});
