import { Prisma } from "@generated/prisma/client/client.ts";
import { logger } from "@lib/logger";
import { prisma } from "@lib/prisma";

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
    // 全てのrelationを静的に定義（RPC型推論のため）
    const data = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        ScheduledMessage: includes.includes("scheduledmessage")
          ? {
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
            }
          : false,
        Omikuji: includes.includes("omikuji")
          ? {
              take: 10,
              orderBy: { createdAt: Prisma.SortOrder.desc },
            }
          : false,
        CoinFlip: includes.includes("coinflip")
          ? {
              take: 100,
              orderBy: { createdAt: Prisma.SortOrder.desc },
            }
          : false,
        JankenChallenger: includes.includes("janken")
          ? {
              take: 50,
              orderBy: { createdAt: Prisma.SortOrder.desc },
            }
          : false,
        JankenOpponent: includes.includes("janken")
          ? {
              take: 50,
              orderBy: { createdAt: Prisma.SortOrder.desc },
            }
          : false,
      },
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

/**
 * ユーザーが所属するサーバーのメンバーを取得する API用
 * @param userId ユーザーID
 * @param page ページ番号（1から開始）
 * @param limit 1ページあたりの件数
 * @param search 検索キーワード
 */
export async function getUsersFromSameGuilds(
  userId: string,
  page = 1,
  limit = 20,
  search?: string,
) {
  try {
    // ユーザーが所属するサーバーのIDリストを取得
    const userGuilds = await prisma.guildMembers.findMany({
      where: { userId },
      select: { guildId: true },
    });

    if (userGuilds.length === 0) {
      return { users: [], total: 0, page, limit };
    }

    const guildIds = userGuilds.map(
      (guild: { guildId: string }) => guild.guildId,
    );

    // 検索条件の構築
    const whereCondition: Prisma.GuildMembersWhereInput = {
      guildId: { in: guildIds },
    };

    // 検索キーワードが指定されている場合
    if (search && search.trim() !== "") {
      whereCondition.user = {
        username: {
          contains: search,
          mode: "insensitive",
        },
      };
    }

    // ユーザーIDの一覧を取得（重複を除去するため）
    const uniqueMembers = await prisma.guildMembers.findMany({
      where: whereCondition,
      select: { userId: true },
      distinct: ["userId"],
    });

    // 重複を除去したユーザーIDの配列
    const uniqueUserIds = uniqueMembers.map(
      (member: { userId: string }) => member.userId,
    );

    // 総数を計算
    const total = uniqueUserIds.length;

    // ページネーションの計算
    const skip = (page - 1) * limit;

    // ユーザーデータの取得（ページネーション対応）
    const pagedUserIds = uniqueUserIds.slice(skip, skip + limit);

    // ユーザー詳細データの取得
    const users = await prisma.users.findMany({
      where: {
        id: {
          in: pagedUserIds,
        },
      },
      orderBy: {
        username: "asc",
      },
    });

    return { users, total, page, limit };
  } catch (error) {
    logger.error(`[users] Error getting users from same guilds: ${error}`);
    throw new UserServiceError(
      "INTERNAL_SERVER_ERROR",
      "Failed to fetch users data",
    );
  }
}
