/*
  Warnings:

  - You are about to drop the `janken_rooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."janken_rooms" DROP CONSTRAINT "janken_rooms_guestId_fkey";

-- DropForeignKey
ALTER TABLE "public"."janken_rooms" DROP CONSTRAINT "janken_rooms_hostId_fkey";

-- DropTable
DROP TABLE "public"."janken_rooms";

-- DropEnum
DROP TYPE "public"."RoomStatus";

-- DropEnum
DROP TYPE "public"."platform";
