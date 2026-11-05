import { mkdirSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

mkdirSync("./data/sqlite", { recursive: true });

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: "./data/sqlite/club.db",
  },
});