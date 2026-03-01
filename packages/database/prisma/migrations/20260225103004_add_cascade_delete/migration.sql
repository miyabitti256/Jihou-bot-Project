-- CreateEnum
CREATE TYPE "platform" AS ENUM ('WEB', 'DISCORD');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('WAITING', 'PLAYING', 'FINISHED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "chat_threads" DROP CONSTRAINT "chat_threads_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "coin_flip" DROP CONSTRAINT "coin_flip_userId_fkey";

-- DropForeignKey
ALTER TABLE "guild_channels" DROP CONSTRAINT "guild_channels_guildId_fkey";

-- DropForeignKey
ALTER TABLE "guild_members" DROP CONSTRAINT "guild_members_guildId_fkey";

-- DropForeignKey
ALTER TABLE "guild_members" DROP CONSTRAINT "guild_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "guild_roles" DROP CONSTRAINT "guild_roles_guildId_fkey";

-- DropForeignKey
ALTER TABLE "janken" DROP CONSTRAINT "janken_challengerId_fkey";

-- DropForeignKey
ALTER TABLE "janken" DROP CONSTRAINT "janken_opponentId_fkey";

-- DropForeignKey
ALTER TABLE "omikuji" DROP CONSTRAINT "omikuji_userId_fkey";

-- DropForeignKey
ALTER TABLE "scheduled_messages" DROP CONSTRAINT "scheduled_messages_channelId_fkey";

-- DropForeignKey
ALTER TABLE "scheduled_messages" DROP CONSTRAINT "scheduled_messages_createdUserId_fkey";

-- DropForeignKey
ALTER TABLE "scheduled_messages" DROP CONSTRAINT "scheduled_messages_guildId_fkey";

-- DropForeignKey
ALTER TABLE "scheduled_messages" DROP CONSTRAINT "scheduled_messages_lastUpdatedUserId_fkey";

-- DropForeignKey
ALTER TABLE "user_settings" DROP CONSTRAINT "user_settings_userId_fkey";

-- CreateTable
CREATE TABLE "janken_rooms" (
    "id" TEXT NOT NULL,
    "roomCode" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "platform" "platform" NOT NULL,
    "channelId" TEXT,
    "status" "RoomStatus" NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "hostId" TEXT NOT NULL,
    "guestId" TEXT,
    "bet" BOOLEAN NOT NULL,
    "betAmount" INTEGER,
    "currentRound" INTEGER NOT NULL DEFAULT 0,
    "hostWins" INTEGER NOT NULL DEFAULT 0,
    "guestWins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "hostReady" BOOLEAN NOT NULL DEFAULT false,
    "guestReady" BOOLEAN NOT NULL DEFAULT false,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "janken_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "janken_rooms_id_key" ON "janken_rooms"("id");

-- CreateIndex
CREATE UNIQUE INDEX "janken_rooms_roomCode_key" ON "janken_rooms"("roomCode");

-- CreateIndex
CREATE INDEX "status_idx" ON "janken_rooms"("status");

-- CreateIndex
CREATE INDEX "last_updated_idx" ON "janken_rooms"("lastUpdated");

-- AddForeignKey
ALTER TABLE "guild_channels" ADD CONSTRAINT "guild_channels_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_roles" ADD CONSTRAINT "guild_roles_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_members" ADD CONSTRAINT "guild_members_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_members" ADD CONSTRAINT "guild_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_messages" ADD CONSTRAINT "scheduled_messages_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_messages" ADD CONSTRAINT "scheduled_messages_lastUpdatedUserId_fkey" FOREIGN KEY ("lastUpdatedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_messages" ADD CONSTRAINT "scheduled_messages_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_messages" ADD CONSTRAINT "scheduled_messages_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "guild_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "omikuji" ADD CONSTRAINT "omikuji_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coin_flip" ADD CONSTRAINT "coin_flip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "janken" ADD CONSTRAINT "janken_challengerId_fkey" FOREIGN KEY ("challengerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "janken" ADD CONSTRAINT "janken_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "janken_rooms" ADD CONSTRAINT "janken_rooms_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "janken_rooms" ADD CONSTRAINT "janken_rooms_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
