import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import { env } from "./env.mjs";

dotenv.config();
 
export default {
  dbCredentials: {
    url: env.DB_URL,
  },
  driver: 'better-sqlite',
  out: "./drizzle",
  schema: "./schema.ts"
} satisfies Config;