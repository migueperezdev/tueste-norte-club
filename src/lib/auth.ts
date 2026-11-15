import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { getDb } from "../db/d1";

export function getAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), { provider: "sqlite" }),
    emailAndPassword: {
      enabled: true,
    },
  });
}