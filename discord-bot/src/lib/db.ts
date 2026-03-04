import { createDatabaseClient } from "@jihou/database/client";
import { env } from "./env";

const { db } = createDatabaseClient(env.DATABASE_URL);

export { db };
