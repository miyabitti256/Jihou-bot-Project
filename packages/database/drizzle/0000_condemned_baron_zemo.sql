-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."ChatRole" AS ENUM('SYSTEM', 'USER', 'ASSISTANT');--> statement-breakpoint
CREATE TYPE "public"."theme" AS ENUM('system', 'light', 'dark');--> statement-breakpoint
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"discriminator" text,
	"avatarUrl" text,
	"money" integer DEFAULT 1000 NOT NULL,
	"lastDraw" timestamp(3),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coin_flip" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"bet" integer NOT NULL,
	"win" boolean NOT NULL,
	"updatedMoney" integer NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "janken" (
	"id" text PRIMARY KEY NOT NULL,
	"bet" boolean NOT NULL,
	"challengerId" text NOT NULL,
	"opponentId" text NOT NULL,
	"challengerHand" text NOT NULL,
	"opponentHand" text NOT NULL,
	"challengerBet" integer,
	"opponentBet" integer,
	"winnerUserId" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduled_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"channelId" text NOT NULL,
	"message" text NOT NULL,
	"time" text NOT NULL,
	"createdUserId" text NOT NULL,
	"lastUpdatedUserId" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"guildId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guilds" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"memberCount" integer NOT NULL,
	"iconUrl" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guild_channels" (
	"id" text PRIMARY KEY NOT NULL,
	"guildId" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"userId" text NOT NULL,
	"theme" "theme" DEFAULT 'system' NOT NULL,
	"locale" text,
	"published" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "omikuji" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"result" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guild_roles" (
	"id" text PRIMARY KEY NOT NULL,
	"guildId" text NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"hoist" boolean NOT NULL,
	"position" integer NOT NULL,
	"permissions" text NOT NULL,
	"managed" boolean NOT NULL,
	"mentionable" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_threads" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"guildId" text NOT NULL,
	"channelId" text NOT NULL,
	"creatorId" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"threadId" text NOT NULL,
	"content" text NOT NULL,
	"role" "ChatRole" NOT NULL,
	"tokenCount" integer NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guild_members" (
	"guildId" text NOT NULL,
	"userId" text NOT NULL,
	"nickname" text,
	"joinedAt" timestamp(3) NOT NULL,
	CONSTRAINT "guild_members_pkey" PRIMARY KEY("guildId","userId")
);
--> statement-breakpoint
ALTER TABLE "coin_flip" ADD CONSTRAINT "coin_flip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "janken" ADD CONSTRAINT "janken_challengerId_fkey" FOREIGN KEY ("challengerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "janken" ADD CONSTRAINT "janken_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "scheduled_messages" ADD CONSTRAINT "scheduled_messages_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."guild_channels"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "scheduled_messages" ADD CONSTRAINT "scheduled_messages_createdUserId_fkey" FOREIGN KEY ("createdUserId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "scheduled_messages" ADD CONSTRAINT "scheduled_messages_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "public"."guilds"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "scheduled_messages" ADD CONSTRAINT "scheduled_messages_lastUpdatedUserId_fkey" FOREIGN KEY ("lastUpdatedUserId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "guild_channels" ADD CONSTRAINT "guild_channels_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "public"."guilds"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "omikuji" ADD CONSTRAINT "omikuji_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "guild_roles" ADD CONSTRAINT "guild_roles_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "public"."guilds"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "public"."chat_threads"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "guild_members" ADD CONSTRAINT "guild_members_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "public"."guilds"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "guild_members" ADD CONSTRAINT "guild_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "users_id_key" ON "users" USING btree ("id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "coin_flip_id_key" ON "coin_flip" USING btree ("id" text_ops);--> statement-breakpoint
CREATE INDEX "challenger_id_idx" ON "janken" USING btree ("challengerId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "janken_id_key" ON "janken" USING btree ("id" text_ops);--> statement-breakpoint
CREATE INDEX "opponent_id_idx" ON "janken" USING btree ("opponentId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "scheduled_messages_id_key" ON "scheduled_messages" USING btree ("id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "guilds_id_key" ON "guilds" USING btree ("id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "guild_channels_id_key" ON "guild_channels" USING btree ("id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "omikuji_id_key" ON "omikuji" USING btree ("id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "guild_roles_id_key" ON "guild_roles" USING btree ("id" text_ops);--> statement-breakpoint
CREATE INDEX "channel_id_idx" ON "chat_threads" USING btree ("channelId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "chat_threads_id_key" ON "chat_threads" USING btree ("id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "chat_messages_id_key" ON "chat_messages" USING btree ("id" text_ops);--> statement-breakpoint
CREATE INDEX "thread_id_idx" ON "chat_messages" USING btree ("threadId" text_ops);
*/