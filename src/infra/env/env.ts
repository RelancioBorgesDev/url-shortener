// env.ts
import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  HOSTNAME: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().default(3333),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string().url(),
  RATE_LIMIT_MAX: z.coerce.number().default(1000),
  RATE_LIMIT_TIME_WINDOW: z.string().default("1 minute"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);
