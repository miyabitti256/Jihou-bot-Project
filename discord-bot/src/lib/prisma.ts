import { PrismaClient } from "@prisma/client";
import { withPulse } from "@prisma/extension-pulse/node";

const apiKey = process.env.PULSE_API_KEY as string;

export const prisma = new PrismaClient().$extends(
  withPulse({ apiKey: apiKey }),
);
