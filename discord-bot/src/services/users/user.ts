import { logger } from "@lib/logger";
import { prisma } from "@lib/prisma";
import { Prisma } from "@prisma/client";

// エラークラス
export class UserServiceError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "UserServiceError";
    this.code = code;
  }
}

// サポートされるインクルードタイプ
export type IncludeType =
  | "scheduledmessage"
  | "omikuji"
  | "coinflip"
  | "janken";

/**
 * ユーザー情報を取得する
 */
export async function getUserData(
  userId: string,
  includes: IncludeType[] = [],
) {
  try {
    const includeMap = {
      ScheduledMessage: {
        select: {
          id: true,
          guildId: true,
          channelId: true,
          message: true,
          scheduleTime: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      Omikuji: {
        take: 10,
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
      },
      CoinFlip: {
        take: 100,
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
      },
      JankenChallenger: {
        take: 50,
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
      },
      JankenOpponent: {
        take: 50,
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
      },
    };

    const keyMap = {
      scheduledmessage: "ScheduledMessage",
      omikuji: "Omikuji",
      coinflip: "CoinFlip",
      janken: "Janken",
    } as const;

    // インクルード設定を構築
    const include = includes.reduce((acc, key) => {
      if (key === "janken") {
        return Object.assign({}, acc, {
          JankenChallenger: includeMap.JankenChallenger,
          JankenOpponent: includeMap.JankenOpponent,
        });
      }
      const mappedKey = keyMap[key];
      if (mappedKey in includeMap) {
        return Object.assign(acc, {
          [mappedKey]: includeMap[mappedKey as keyof typeof includeMap],
        });
      }
      return acc;
    }, {});

    // ユーザーデータを取得
    const data = await prisma.users.findUnique({
      where: { id: userId },
      include,
    });

    if (!data) {
      throw new UserServiceError("USER_NOT_FOUND", "User not found");
    }

    return data;
  } catch (error) {
    if (error instanceof UserServiceError) {
      throw error;
    }
    logger.error(`[users] Error getting user data: ${error}`);
    throw new UserServiceError(
      "INTERNAL_SERVER_ERROR",
      "Internal server error",
    );
  }
}

/**
 * ユーザーを作成または更新する
 */
export async function createOrUpdateUser(userData: {
  id: string;
  username: string;
  discriminator?: string | null;
  avatarUrl?: string | null;
}) {
  try {
    return await prisma.users.upsert({
      where: { id: userData.id },
      update: {
        username: userData.username,
        discriminator: userData.discriminator || null,
        avatarUrl: userData.avatarUrl || null,
      },
      create: {
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator || null,
        avatarUrl: userData.avatarUrl || null,
        money: 1000, // 初期所持金
      },
    });
  } catch (error) {
    logger.error(`[users] Error creating/updating user: ${error}`);
    throw new UserServiceError(
      "INTERNAL_SERVER_ERROR",
      "Failed to update user data",
    );
  }
}

/**
 * ユーザーが存在するか確認し、存在しない場合は作成する
 */
export async function ensureUserExists(
  userId: string,
  username: string,
  avatarUrl?: string,
): Promise<void> {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      await prisma.users.create({
        data: {
          id: userId,
          username,
          avatarUrl,
          money: 1000, // デフォルト値
          discriminator: "0",
        },
      });
      logger.info(`[users] Created new user: ${userId} (${username})`);
    }
  } catch (error) {
    logger.error(`[users] Error ensuring user exists: ${error}`);
    throw new UserServiceError(
      "INTERNAL_SERVER_ERROR",
      "Failed to check/create user data",
    );
  }
}

/**
 * ユーザーの所持金を更新する
 */
export async function updateUserMoney(
  userId: string,
  amount: number,
  operation: "add" | "set" = "add",
) {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { money: true },
    });

    if (!user) {
      throw new UserServiceError("USER_NOT_FOUND", "User not found");
    }

    const newAmount =
      operation === "add"
        ? Math.max(0, user.money + amount)
        : Math.max(0, amount);

    return await prisma.users.update({
      where: { id: userId },
      data: { money: newAmount },
    });
  } catch (error) {
    if (error instanceof UserServiceError) {
      throw error;
    }
    logger.error(`[users] Error updating user money: ${error}`);
    throw new UserServiceError(
      "INTERNAL_SERVER_ERROR",
      "Failed to update user money",
    );
  }
}
