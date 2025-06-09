import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

export const urls = pgTable("urls", {
  id: uuid("id").primaryKey().defaultRandom(),
  originalUrl: text("original_url").notNull(),
  shortCode: varchar("short_code", { length: 10 }).notNull().unique(),
  shortUrl: varchar("short_url", { length: 100 }).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  expiresAt: timestamp("expires_at", { mode: "date" }),
});
