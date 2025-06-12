import { eq } from "drizzle-orm";
import { AnalyticsRepository as AnalyticsInterface } from "../../../domain/urls/application/repositories/analytics-repository.ts";
import { Analytics } from "../../../domain/urls/enterprise/entities/analytics.ts";
import { db } from "../client.ts";
import { schema } from "../schema/index.ts";
import { analytics as schemaAnalytics } from "../schema/analytics.ts";
import { UniqueEntityID } from "../../../core/entities/unique-entity-id.ts";

export class AnalyticsRepository implements AnalyticsInterface {
  async create(analytics: Analytics) {
    await db.insert(schemaAnalytics).values({
      url_id: analytics.urlId,
      ipAddress: analytics.ipAddress,
      userAgent: analytics.userAgent,
      referrer: analytics.referrer,
      country: analytics.country,
      accessedAt: analytics.accessedAt,
    });
  }

  async findByUrlId(urlId: string): Promise<Analytics[]> {
    const results = await db
      .select()
      .from(schemaAnalytics)
      .where(eq(schemaAnalytics.url_id, urlId));

    return results.map((row) =>
      Analytics.create(
        {
          urlId: row.url_id!,
          ipAddress: row.ipAddress ?? "",
          userAgent: row.userAgent ?? "",
          referrer: row.referrer ?? "",
          country: row.country ?? "unknown",
          accessedAt: row.accessedAt ?? new Date(),
        },
        new UniqueEntityID(row.id)
      )
    );
  }
}
