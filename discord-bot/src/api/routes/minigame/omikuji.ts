import { prisma } from "@lib/prisma";
import { getTokyoDate, hasDrawnToday } from "@lib/utils";
import { Hono } from "hono";

export const omikuji = new Hono();

omikuji.get("/result/:userId", async (c) => {
  const userId = c.req.param("userId");
  const takeQuery = c.req.query("take");
  const take = takeQuery ? Number.parseInt(takeQuery) : 10;

  try {
    const data = await prisma.omikuji.findMany({
      where: {
        userId,
      },
      take: Math.min(take, 100),
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json(
      {
        status: "success",
        data,
      },
      200,
    );
  } catch (error) {
    return c.json(
      {
        status: "error",
        error: {
          code: "INTERNALSERVERERROR",
          message: "Internal server error",
          details: error,
        },
      },
      500,
    );
  }
});

omikuji.post("/draw", async (c) => {
  const body = await c.req.json();
  const id = body.userId;

  if (!id) {
    return c.json(
      {
        status: "error",
        error: {
          message: "ユーザーIDが見つかりません",
          code: "MISSING_USER_ID",
        },
      },
      400,
    );
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return c.json(
        {
          status: "error",
          error: {
            message: "データが見つかりません",
            code: "USER_NOT_FOUND",
          },
        },
        404,
      );
    }

    const now = getTokyoDate();
    if (hasDrawnToday(now, user.lastDraw ?? new Date(0))) {
      return c.json(
        {
          status: "error",
          error: {
            message: "おみくじは一日に一度しか引けません",
            code: "ALREADY_DRAWN",
          },
        },
        400,
      );
    }

    const result = drawOmikuji();
    const money = Math.max(0, user.money + result.money);

    await updateUserAndCreateResult(id, money, now, result.result);
    return c.json(
      {
        status: "success",
        data: {
          result: result.result,
          money,
        },
      },
      200,
    );
  } catch (error) {
    return c.json(
      {
        status: "error",
        error: {
          message: "おみくじの処理に失敗しました",
          code: "INTERNALSERVERERROR",
          detail: error,
        },
      },
      500,
    );
  }
});

const OMIKUJI_TYPES = {
  NUBEKICHI: "ぬべ吉",
  DAIKICHI: "大吉",
  KICHI: "吉",
  CHUKICHI: "中吉",
  SHOKICHI: "小吉",
  SUEKICHI: "末吉",
  KYO: "凶",
  DAIKYO: "大凶",
  BAD_NUBEKICHI: "ヌベキチ└(՞ةڼ◔)」",
} as const;

const OMIKUJI_RESULTS = [
  { result: OMIKUJI_TYPES.NUBEKICHI, probability: 1, money: 20000 },
  { result: OMIKUJI_TYPES.DAIKICHI, probability: 8, money: 1000 },
  { result: OMIKUJI_TYPES.KICHI, probability: 12, money: 500 },
  { result: OMIKUJI_TYPES.CHUKICHI, probability: 16, money: 300 },
  { result: OMIKUJI_TYPES.SHOKICHI, probability: 22, money: 200 },
  { result: OMIKUJI_TYPES.SUEKICHI, probability: 22, money: 100 },
  { result: OMIKUJI_TYPES.KYO, probability: 12, money: -50 },
  { result: OMIKUJI_TYPES.DAIKYO, probability: 5, money: -100 },
  { result: OMIKUJI_TYPES.BAD_NUBEKICHI, probability: 2, money: -300 },
] as const;

type OmikujiResult = (typeof OMIKUJI_RESULTS)[number]["result"];

function drawOmikuji(): { result: OmikujiResult; money: number } {
  const totalProbability = OMIKUJI_RESULTS.reduce(
    (acc, result) => acc + result.probability,
    0,
  );
  let random = Math.floor(Math.random() * totalProbability);

  for (const result of OMIKUJI_RESULTS) {
    if (random < result.probability) {
      return { result: result.result, money: result.money };
    }
    random -= result.probability;
  }

  return { result: OMIKUJI_TYPES.SUEKICHI, money: 100 };
}

async function updateUserAndCreateResult(
  userId: string,
  money: number,
  date: Date,
  result: OmikujiResult,
) {
  return prisma.$transaction([
    prisma.users.update({
      where: { id: userId },
      data: { money, lastDraw: date },
    }),
    prisma.omikuji.create({
      data: { userId, result },
    }),
  ]);
}
