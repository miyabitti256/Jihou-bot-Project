import { createDatabaseClient } from "@jihou/database/client";
import { env } from "./env";

const { prisma, pool } = createDatabaseClient(env.DATABASE_URL);

export { pool, prisma };
