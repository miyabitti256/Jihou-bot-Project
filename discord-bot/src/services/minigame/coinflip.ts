import { prisma } from "@bot/lib/prisma";

export class CoinflipError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CoinflipError";
  }
}

export type CoinChoice = "heads" | "tails";

export interface CoinResult {
  win: boolean;
  coinResult: CoinChoice;
  bet: number;
  updatedMoney: number;
  moneyChange: number;
}

/**
 * コインフリップゲームをプレイする関数
 * @param userId ユーザーID
 * @param bet 賭け金
 * @param choice ユーザーの選択（"heads" または "tails"）
 * @returns ゲーム結果情報
 * @throws {CoinflipError} ユーザーが見つからない場合や無効な賭け金の場合
 */
export async function playCoinflip(
  userId: string,
  bet: number,
  choice: CoinChoice,
): Promise<CoinResult> {
  // ユーザー確認
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { money: true },
  });

  if (!user) {
    throw new CoinflipError("MONEY_DATA_NOT_FOUND");
  }

  // 所持金のチェック
  if (user.money <= 0) {
    throw new CoinflipError("NO_MONEY");
  }

  // 賭け金チェック
  if (bet < 1) {
    throw new CoinflipError("INVALID_BET");
  }

  // 最大賭け金チェック
  const maxBet = Math.min(user.money, 10000);
  if (bet > maxBet) {
    throw new CoinflipError("INVALID_BET_AMOUNT");
  }

  // コイントス結果計算
  const result: CoinChoice = Math.random() >= 0.5 ? "heads" : "tails";
  const win = choice === result;
  const resultMoney = win ? bet : -bet;

  // DB更新（トランザクションでアトミックに実行）
  const [updatedUser] = await prisma.$transaction([
    prisma.users.update({
      where: { id: userId },
      data: { money: user.money + resultMoney },
    }),
    prisma.coinFlip.create({
      data: {
        userId,
        bet,
        win,
        updatedMoney: user.money + resultMoney,
      },
    }),
  ]);

  // 結果を返す
  return {
    win,
    coinResult: result,
    bet,
    updatedMoney: updatedUser.money,
    moneyChange: resultMoney,
  };
}

/**
 * ユーザーの所持金情報を取得する関数
 * @param userId ユーザーID
 * @returns ユーザーの所持金
 */
export async function getUserMoneyStatus(userId: string): Promise<number> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { money: true },
  });

  return user?.money || 0;
}

/**
 * コインフリップの履歴を取得する関数
 * @param userId ユーザーID
 * @param take 取得する結果の数
 */
export async function getCoinflipHistory(userId: string, take = 100) {
  return await prisma.coinFlip.findMany({
    where: { userId },
    take: Math.min(take, 100),
    orderBy: { createdAt: "desc" },
  });
}
