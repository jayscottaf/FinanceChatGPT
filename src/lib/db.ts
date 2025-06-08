import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['error'],
    });
  }
  db = global.prisma;
}

// Test database connection
async function testConnection() {
  try {
    await db.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

// Only test connection if POSTGRES_PRISMA_URL is set
if (process.env.POSTGRES_PRISMA_URL) {
  testConnection();
} else {
  console.warn("POSTGRES_PRISMA_URL not set - database features will be unavailable");
}

export default db;
