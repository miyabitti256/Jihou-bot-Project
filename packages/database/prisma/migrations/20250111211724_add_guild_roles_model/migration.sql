/*
  Warnings:

  - Added the required column `guildId` to the `scheduled_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scheduled_messages" ADD COLUMN     "guildId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "guild_roles" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "hoist" BOOLEAN NOT NULL,
    "position" INTEGER NOT NULL,
    "permissions" TEXT NOT NULL,
    "managed" BOOLEAN NOT NULL,
    "mentionable" BOOLEAN NOT NULL,

    CONSTRAINT "guild_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guild_roles_id_key" ON "guild_roles"("id");

-- AddForeignKey
ALTER TABLE "guild_roles" ADD CONSTRAINT "guild_roles_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_messages" ADD CONSTRAINT "scheduled_messages_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
