import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { urls } from "./urls.ts";

export const analytics = pgTable(
  "analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    urlId: uuid("url_id").references(() => urls.id, { onDelete: "cascade" }),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    referrer: text("referrer"),
    country: varchar("country", { length: 50 }),
    accessedAt: timestamp("accessed_at").defaultNow(),
  },
  (table) => [
    index("idx_analytics_url_id").on(table.urlId),
    index("idx_analytics_accessed_at").on(table.accessedAt),
  ],
);
