import type { Config } from "drizzle-kit";
import { env } from "./env.mjs";
 
export default {
  dbCredentials: {
    url: env.DB_URL,
  },
  driver: "better-sqlite",
  out: "./drizzle",
  schema: "./schema.ts"
} satisfies Config;