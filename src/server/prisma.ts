// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";
import { env } from "./env";

declare global {
  var prisma: PrismaClient | undefined;
}

let logLevel: any = ["query", "info", "warn", "error"]

if (env.NODE_ENV === "production") {
  logLevel = ["error"]
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: logLevel,
    errorFormat: "pretty"
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}