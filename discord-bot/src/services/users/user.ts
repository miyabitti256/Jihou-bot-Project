import { db } from "@bot/lib/db";
import { logger } from "@bot/lib/logger";
import {
  coinFlip,
  guildMembers,
  janken,
  omikuji,
  users,
} from "@jihou/database";
import { and, asc, desc, eq, ilike, inArray } from "drizzle-orm";

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
    const data = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        scheduledMessages_createdUserId: includes.includes("scheduledmessage")
          ? {
              columns: {
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
          : undefined,
        omikujis: includes.includes("omikuji")
          ? {
              limit: 10,
              orderBy: desc(omikuji.createdAt),
            }
          : undefined,
        coinFlips: includes.includes("coinflip")
          ? {
              limit: 100,
              orderBy: desc(coinFlip.createdAt),
            }
          : undefined,
        jankens_challengerId: includes.includes("janken")
          ? {
              limit: 50,
              orderBy: desc(janken.createdAt),
            }
          : undefined,
        jankens_opponentId: includes.includes("janken")
          ? {
              limit: 50,
              orderBy: desc(janken.createdAt),
            }
          : undefined,
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
    const [result] = await db
      .insert(users)
      .values({
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator || null,
        avatarUrl: userData.avatarUrl || null,
        money: 1000,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          username: userData.username,
          discriminator: userData.discriminator || null,
          avatarUrl: userData.avatarUrl || null,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result;
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
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true },
    });

    if (!user) {
      await db.insert(users).values({
        id: userId,
        username,
        avatarUrl,
        money: 1000,
        discriminator: "0",
        updatedAt: new Date(),
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
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { money: true },
    });

    if (!user) {
      throw new UserServiceError("USER_NOT_FOUND", "User not found");
    }

    const newAmount =
      operation === "add"
        ? Math.max(0, user.money + amount)
        : Math.max(0, amount);

    const [result] = await db
      .update(users)
      .set({ money: newAmount, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return result;
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
    const userGuilds = await db
      .select({ guildId: guildMembers.guildId })
      .from(guildMembers)
      .where(eq(guildMembers.userId, userId));

    if (userGuilds.length === 0) {
      return { users: [], total: 0, page, limit };
    }

    const guildIds = userGuilds.map((guild) => guild.guildId);

    // ユニークなユーザーIDの取得
    const baseCondition = inArray(guildMembers.guildId, guildIds);

    let uniqueMembers: { userId: string }[];
    if (search && search.trim() !== "") {
      // 検索キーワード付き: guildMembers と users を JOIN
      uniqueMembers = await db
        .selectDistinct({ userId: guildMembers.userId })
        .from(guildMembers)
        .innerJoin(users, eq(guildMembers.userId, users.id))
        .where(and(baseCondition, ilike(users.username, `%${search}%`)));
    } else {
      uniqueMembers = await db
        .selectDistinct({ userId: guildMembers.userId })
        .from(guildMembers)
        .where(baseCondition);
    }

    const uniqueUserIds = uniqueMembers.map((member) => member.userId);
    const total = uniqueUserIds.length;

    // ページネーション
    const skip = (page - 1) * limit;
    const pagedUserIds = uniqueUserIds.slice(skip, skip + limit);

    // ユーザー詳細データの取得
    const usersData =
      pagedUserIds.length > 0
        ? await db.query.users.findMany({
            where: inArray(users.id, pagedUserIds),
            orderBy: asc(users.username),
          })
        : [];

    return { users: usersData, total, page, limit };
  } catch (error) {
    logger.error(`[users] Error getting users from same guilds: ${error}`);
    throw new UserServiceError(
      "INTERNAL_SERVER_ERROR",
      "Failed to fetch users data",
    );
  }
}
