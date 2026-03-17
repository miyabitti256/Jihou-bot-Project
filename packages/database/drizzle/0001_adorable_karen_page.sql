ALTER TABLE "_prisma_migrations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "_prisma_migrations" CASCADE;--> statement-breakpoint
ALTER TABLE "omikuji" ADD COLUMN "withText" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "omikuji" ADD COLUMN "aiText" text;