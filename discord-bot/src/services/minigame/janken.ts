import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import type { User } from "discord.js";
import type { ChoiceKey } from "@/commands/janken";
import {
  ensureUserExists as ensureUser,
  updateUserMoney,
} from "@/services/users";

interface JankenGameResult {
  challengerId: string;
  opponentId: string;
  challengerHand: ChoiceKey;
  opponentHand: ChoiceKey;
  challengerBet: number;
  opponentBet: number;
  winnerUserId: string | null;
  bet: boolean;
}

/**
 * ユーザーの残高を取得する
 */
export async function getUserBalance(userId: string): Promise<number> {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { money: true },
    });

    return user?.money ?? 0;
  } catch (error) {
    logger.error(`[JankenService] Error fetching user balance: ${error}`);
    return 0;
  }
}

/**
 * ユーザーが存在しない場合は作成する
 */
export async function ensureUserExists(
  userId: string,
  username: string,
): Promise<number> {
  try {
    await ensureUser(userId, username);

    // 残高を取得
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { money: true },
    });

    return user?.money ?? 1000;
  } catch (error) {
    logger.error(`[JankenService] Error ensuring user exists: ${error}`);
    return 1000; // エラー時はデフォルト値を返す
  }
}

/**
 * じゃんけんの結果を保存する
 */
export async function saveJankenResult(
  result: JankenGameResult,
): Promise<boolean> {
  try {
    await prisma.janken.create({
      data: result,
    });
    return true;
  } catch (error) {
    logger.error(`[JankenService] Error saving janken result: ${error}`);
    return false;
  }
}

/**
 * 賭けの結果を処理する
 */
export async function handleBetResult(
  challengerId: string,
  opponentId: string,
  winnerId: string | null,
  challengerBet: number,
  opponentBet: number,
): Promise<boolean> {
  try {
    if (!winnerId) {
      // 引き分けの場合は処理不要
      return true;
    }

    // userサービスの関数を使って賭け金を処理
    if (winnerId === challengerId) {
      // チャレンジャーの勝ち
      await Promise.all([
        updateUserMoney(challengerId, opponentBet, "add"),
        updateUserMoney(opponentId, -opponentBet, "add"),
      ]);
    } else {
      // 対戦相手の勝ち
      await Promise.all([
        updateUserMoney(opponentId, challengerBet, "add"),
        updateUserMoney(challengerId, -challengerBet, "add"),
      ]);
    }
    return true;
  } catch (error) {
    logger.error(`[JankenService] Error handling bet result: ${error}`);
    return false;
  }
}

/**
 * 両プレイヤーの残高を確認する
 */
export async function checkBothUserBalances(
  challenger: User,
  opponent: User,
): Promise<{ challengerBalance: number; opponentBalance: number }> {
  try {
    const [challengerBalance, opponentBalance] = await Promise.all([
      ensureUserExists(challenger.id, challenger.username),
      ensureUserExists(opponent.id, opponent.username),
    ]);

    return { challengerBalance, opponentBalance };
  } catch (error) {
    logger.error(`[JankenService] Error checking both user balances: ${error}`);
    // エラー時はデフォルト値を返す
    return { challengerBalance: 1000, opponentBalance: 1000 };
  }
}
