import { Prisma, PrismaClient } from "@prisma/client";

declare const process: {
  env: Record<string, string | undefined>;
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as { prisma?: PrismaClient };

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ["error"] as Prisma.LogLevel[],
    });
  }
  db = globalForPrisma.prisma;
}

// Test database connection
async function testConnection(): Promise<void> {
  try {
    await db.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database connection failed:", error.message);
    } else {
      console.error("Database connection failed:", error);
    }
  }
}

// Only test connection if POSTGRES_PRISMA_URL is set
if (process.env.POSTGRES_PRISMA_URL) {
  void testConnection();
} else {
  console.warn(
    "POSTGRES_PRISMA_URL not set - database features will be unavailable"
  );
}

export default db;
