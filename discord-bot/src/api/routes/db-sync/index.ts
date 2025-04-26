import { Hono } from "hono";
import { prisma } from "@lib/prisma";
import { logger } from "@lib/logger";
import {
  updateGuildData,
  updateChannelsData,
  updateMembersData,
  updateRolesData,
  createDefaultRoles,
} from "./services";
import { z } from "zod";

export const dbSync = new Hono();

// ギルドデータの同期
dbSync.post("/guild", async (c) => {
  try {
    const bodySchema = z.object({
      guildId: z.string(),
      guildData: z.object({
        id: z.string(),
        name: z.string(),
        memberCount: z.number(),
        iconUrl: z.string().nullable(),
      }),
    });

    const result = bodySchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALIDREQUEST",
            message: "Invalid request body",
            details: result.error,
          },
        },
        400,
      );
    }

    const { guildId, guildData } = result.data;
    const updatedGuild = await updateGuildData(guildData);

    return c.json({
      status: "success",
      data: updatedGuild,
    });
  } catch (error) {
    logger.error("Error updating guild data:", error);
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

// チャンネルデータの同期
dbSync.post("/channels", async (c) => {
  try {
    const bodySchema = z.object({
      guildId: z.string(),
      channels: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          type: z.string(),
        }),
      ),
    });

    const result = bodySchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALIDREQUEST",
            message: "Invalid request body",
            details: result.error,
          },
        },
        400,
      );
    }

    const { guildId, channels } = result.data;
    await updateChannelsData(guildId, channels);

    return c.json({
      status: "success",
      message: `Updated ${channels.length} channels for guild ${guildId}`,
    });
  } catch (error) {
    logger.error("Error updating channels data:", error);
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

// メンバーデータの同期
dbSync.post("/members", async (c) => {
  try {
    const bodySchema = z.object({
      guildId: z.string(),
      members: z.array(
        z.object({
          user: z.object({
            id: z.string(),
            username: z.string(),
            discriminator: z.string().nullable(),
            avatarUrl: z.string().nullable(),
          }),
          member: z.object({
            nickname: z.string().nullable(),
            joinedAt: z.string().transform((str) => new Date(str)),
          }),
        }),
      ),
    });

    const result = bodySchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALIDREQUEST",
            message: "Invalid request body",
            details: result.error,
          },
        },
        400,
      );
    }

    const { guildId, members } = result.data;
    await updateMembersData(guildId, members);

    return c.json({
      status: "success",
      message: `Updated ${members.length} members for guild ${guildId}`,
    });
  } catch (error) {
    logger.error("Error updating members data:", error);
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

// ロールデータの同期
dbSync.post("/roles", async (c) => {
  try {
    const bodySchema = z.object({
      guildId: z.string(),
      roles: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          color: z.string(),
          position: z.number(),
          permissions: z.string(),
          hoist: z.boolean(),
          managed: z.boolean(),
          mentionable: z.boolean(),
        }),
      ),
    });

    const result = bodySchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALIDREQUEST",
            message: "Invalid request body",
            details: result.error,
          },
        },
        400,
      );
    }

    const { guildId, roles } = result.data;
    await updateRolesData(guildId, roles);

    return c.json({
      status: "success",
      message: `Updated ${roles.length} roles for guild ${guildId}`,
    });
  } catch (error) {
    logger.error("Error updating roles data:", error);
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

// ギルド削除
dbSync.delete("/guild/:guildId", async (c) => {
  try {
    const guildId = c.req.param("guildId");

    if (!guildId) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALIDREQUEST",
            message: "Invalid guildId",
          },
        },
        400,
      );
    }

    await prisma.$transaction([
      prisma.guild.delete({ where: { id: guildId } }),
      prisma.guildChannels.deleteMany({ where: { guildId } }),
      prisma.guildRoles.deleteMany({ where: { guildId } }),
      prisma.guildMembers.deleteMany({ where: { guildId } }),
    ]);

    return c.json({
      status: "success",
      message: `Deleted guild ${guildId} and all related data`,
    });
  } catch (error) {
    logger.error("Error deleting guild data:", error);
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

// メンバー削除
dbSync.delete("/members/:guildId/:userId", async (c) => {
  try {
    const guildId = c.req.param("guildId");
    const userId = c.req.param("userId");

    if (!guildId || !userId) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALIDREQUEST",
            message: "Invalid guildId or userId",
          },
        },
        400,
      );
    }

    await prisma.guildMembers.delete({
      where: {
        guildId_userId: {
          guildId,
          userId,
        },
      },
    });

    return c.json({
      status: "success",
      message: `Deleted member ${userId} from guild ${guildId}`,
    });
  } catch (error) {
    logger.error("Error deleting member data:", error);
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

// デフォルトのロールを作成
dbSync.post("/default-roles", async (c) => {
  try {
    const bodySchema = z.object({
      guildId: z.string(),
    });

    const result = bodySchema.safeParse(await c.req.json());

    if (!result.success) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALIDREQUEST",
            message: "Invalid request body",
            details: result.error,
          },
        },
        400,
      );
    }

    const { guildId } = result.data;
    const roleData = await createDefaultRoles(guildId);

    return c.json({
      status: "success",
      data: roleData,
    });
  } catch (error) {
    logger.error("Error creating default roles:", error);
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
