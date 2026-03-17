import { db } from "@bot/lib/db";
import { generateText } from "@bot/lib/gemini-client";
import { logger } from "@bot/lib/logger";
import { getTokyoDate, hasDrawnToday } from "@bot/lib/utils";
import { omikuji, users } from "@jihou/database";
import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq } from "drizzle-orm";

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
  id?: string;
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
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
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
  const omikujiId = await updateUserAndCreateResult(
    userId,
    money,
    now,
    result.result,
  );

  return {
    id: omikujiId,
    result: result.result,
    money,
  };
}

/**
 * AIによるおみくじの解説文を生成・取得する
 * @param omikujiId おみくじ結果ID
 * @param userId ユーザーID
 * @returns AIによる解説文
 * @throws {OmikujiError} おみくじが見つからない場合や、所有者が違う場合
 */
export async function generateOmikujiAIText(
  omikujiId: string,
  userId: string,
): Promise<string> {
  const record = await db.query.omikuji.findFirst({
    where: and(eq(omikuji.id, omikujiId), eq(omikuji.userId, userId)),
  });

  if (!record) {
    throw new OmikujiError("OMIKUJI_NOT_FOUND");
  }

  if (record.withText && record.aiText) {
    return record.aiText;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new OmikujiError("USER_NOT_FOUND");
  }

  const prompt = createFortunePrompt(record.result, user.username);

  try {
    const aiText = await generateText(prompt);

    await db
      .update(omikuji)
      .set({ withText: true, aiText })
      .where(eq(omikuji.id, omikujiId));

    return aiText;
  } catch (error) {
    logger.error(`[omikuji] AI text generation error: ${error}`);
    throw new OmikujiError("AI_GENERATION_FAILED");
  }
}

/**
 * 運勢に応じたAIへのプロンプトを作成する
 */
export function createFortunePrompt(fortune: string, username: string): string {
  return `あなたは神社の占い師です。ユーザー「${username}」さんがおみくじを引いたところ「${fortune}」という結果が出ました。
以下の厳密なフォーマットに従って、関西弁で楽しく前向きなおみくじ結果を生成してください。

===フォーマット===
【今日の運勢】${fortune}
【アドバイス】
(ここに2～3行の関西弁での前向きなアドバイスを書いてください)

【運気】
・総合運：(★1～5つで表現)
・金運：(★1～5つで表現)
・恋愛運：(★1～5つで表現)
・健康運：(★1～5つで表現)

【ラッキーアイテム】
(1つだけ具体的なアイテムを書いてください)

【ひとこと】
(ここに関西弁で一言メッセージを書いてください。絵文字を1～2個使用)
=============

※ 必ず上記フォーマットを守ってください。各セクションの間に余計な行を入れないでください。
※ ===フォーマット=== と ============= は入れないでください。
※ 必ず関西弁で書いてください。例:「〜です」→「〜やで」「〜だよ」→「〜やで」「〜ですね」→「〜やな」など
※ 「${fortune}」という運勢に合った内容にしてください。
※ 全体で200～300文字程度に収めてください。`;
}

/**
 * おみくじの履歴を取得する関数
 * @param userId ユーザーID
 * @param take 取得する結果の数
 */
export async function getOmikujiHistory(userId: string, take = 10) {
  return await db.query.omikuji.findMany({
    where: eq(omikuji.userId, userId),
    limit: Math.min(take, 100),
    orderBy: desc(omikuji.createdAt),
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
): Promise<string> {
  const id = createId();
  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ money, lastDraw: date, updatedAt: new Date() })
      .where(eq(users.id, userId));
    await tx.insert(omikuji).values({
      id,
      userId,
      result,
    });
  });
  return id;
}
