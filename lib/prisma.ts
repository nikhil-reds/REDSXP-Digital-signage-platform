import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const DEFAULT_CONNECTION_TIMEOUT_MS = 5000;

function normalizeConnectionString(connectionString: string) {
  const url = new URL(connectionString);
  if (url.searchParams.get("sslmode") === "require") {
    url.searchParams.set("sslmode", "verify-full");
  }
  return url.toString();
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const connectionTimeoutMillis =
    Number(process.env.DATABASE_CONNECTION_TIMEOUT_MS) || DEFAULT_CONNECTION_TIMEOUT_MS;

  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: normalizeConnectionString(connectionString),
      connectionTimeoutMillis,
    }),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
