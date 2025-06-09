import { Prisma, PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let db: PrismaClient;

if ((process.env as any).NODE_ENV === "production") {
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
if ((process.env as any).POSTGRES_PRISMA_URL) {
  void testConnection();
} else {
  console.warn(
    "POSTGRES_PRISMA_URL not set - database features will be unavailable"
  );
}

export default db;
