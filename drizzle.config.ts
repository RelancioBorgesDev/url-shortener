import { defineConfig } from "drizzle-kit";
import { env } from "./src/infra/env/env.ts";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be configured");
}

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  schema: "src/infra/database/schema/*",
  out: "src/infra/database/migrations/*",
  casing: "snake_case",
});
