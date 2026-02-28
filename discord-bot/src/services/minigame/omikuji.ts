import { prisma } from "@/lib/prisma";
import { getTokyoDate, hasDrawnToday } from "@/lib/utils";

export interface OmikujiTypes {
  NUBEKICHI: string;
  DAIKICHI: string;
  KICHI: string;
  CHUKICHI: string;
  SHOKICHI: string;
  SUEKICHI: string;
  KYO: string;
  DAIKYO: string;
  BAD_NUBEKICHI: string;
}

export const OMIKUJI_TYPES: OmikujiTypes = {
  NUBEKICHI: "ぬべ吉",
  DAIKICHI: "大吉",
  KICHI: "吉",
  CHUKICHI: "中吉",
  SHOKICHI: "小吉",
  SUEKICHI: "末吉",
  KYO: "凶",
  DAIKYO: "大凶",
  BAD_NUBEKICHI: "ヌベキチ└(՞ةڼ◔)」",
};

export type OmikujiType = (typeof OMIKUJI_TYPES)[keyof typeof OMIKUJI_TYPES];

export interface OmikujiResult {
  result: OmikujiType;
  money: number;
}

interface OmikujiResultOption {
  result: OmikujiType;
  probability: number;
  money: number;
}

export class OmikujiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OmikujiError";
  }
}

const OMIKUJI_RESULTS: OmikujiResultOption[] = [
  { result: OMIKUJI_TYPES.NUBEKICHI, probability: 1, money: 20000 },
  { result: OMIKUJI_TYPES.DAIKICHI, probability: 8, money: 1000 },
  { result: OMIKUJI_TYPES.KICHI, probability: 12, money: 500 },
  { result: OMIKUJI_TYPES.CHUKICHI, probability: 16, money: 300 },
  { result: OMIKUJI_TYPES.SHOKICHI, probability: 22, money: 200 },
  { result: OMIKUJI_TYPES.SUEKICHI, probability: 22, money: 100 },
  { result: OMIKUJI_TYPES.KYO, probability: 12, money: -50 },
  { result: OMIKUJI_TYPES.DAIKYO, probability: 5, money: -100 },
  { result: OMIKUJI_TYPES.BAD_NUBEKICHI, probability: 2, money: -300 },
];

/**
 * おみくじを引く関数
 * @param userId ユーザーID
 * @returns おみくじの結果と更新後のお金
 * @throws {OmikujiError} ユーザーが見つからない場合や、すでに今日引いている場合
 */
export async function drawOmikuji(userId: string): Promise<OmikujiResult> {
  // ユーザー存在チェック
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new OmikujiError("USER_NOT_FOUND");
  }

  // 一日一回制限チェック
  const now = getTokyoDate();
  if (hasDrawnToday(now, user.lastDraw ?? new Date(0))) {
    throw new OmikujiError("ALREADY_DRAWN");
  }

  // おみくじ結果の決定
  const result = calculateOmikujiResult();
  const money = Math.max(0, user.money + result.money);

  // データベース更新
  await updateUserAndCreateResult(userId, money, now, result.result);

  return {
    result: result.result,
    money,
  };
}

/**
 * おみくじの履歴を取得する関数
 * @param userId ユーザーID
 * @param take 取得する結果の数
 */
export async function getOmikujiHistory(userId: string, take = 10) {
  return await prisma.omikuji.findMany({
    where: { userId },
    take: Math.min(take, 100),
    orderBy: { createdAt: "desc" },
  });
}

/**
 * おみくじの結果を計算する内部関数
 */
function calculateOmikujiResult(): OmikujiResult {
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

  // フォールバック（通常は到達しない）
  return {
    result: OMIKUJI_TYPES.SUEKICHI,
    money: 100,
  };
}

/**
 * ユーザーのデータを更新し、おみくじ結果を保存する内部関数
 */
async function updateUserAndCreateResult(
  userId: string,
  money: number,
  date: Date,
  result: OmikujiType,
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
