import { mkdirSync } from "node:fs";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

mkdirSync("./data/sqlite", { recursive: true });

export const sqlite = new Database("./data/sqlite/club.db");

sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });