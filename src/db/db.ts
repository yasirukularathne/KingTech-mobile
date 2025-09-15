import { PrismaClient } from "@prisma/client";

function prismaClientSingleton() {
  return new PrismaClient();
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const db: PrismaClient = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
