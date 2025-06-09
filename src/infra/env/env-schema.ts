import { z } from "zod";

const envSchema = z.object({
  HOSTNAME: z.string().default("0.0.0.0"),
  PORT: z.number().default(3333),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
