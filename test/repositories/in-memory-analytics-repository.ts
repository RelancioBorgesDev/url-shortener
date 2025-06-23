import { UniqueEntityID } from "../../src/core/entities/unique-entity-id.ts";
import { AnalyticsRepository } from "../../src/domain/urls/application/repositories/analytics-repository.ts";
import { Analytics } from "../../src/domain/urls/enterprise/entities/analytics.ts";

export class InMemoryAnalyticsRepository implements AnalyticsRepository {
  public items: Analytics[] = [];

  async create(analytics: Analytics): Promise<void> {
    const { id, accessedAt, country, ipAddress, referrer, urlId, userAgent } =
      analytics;
    const newAnalytics = await Analytics.create(
      {
        accessedAt,
        country,
        ipAddress,
        referrer,
        urlId,
        userAgent,
      },
      new UniqueEntityID(id.toString())
    );
    this.items.push(newAnalytics);
  }

  async findByUrlId(urlId: string): Promise<Analytics[]> {
    const analytics = this.items.filter((item) => item.urlId === urlId);

    return analytics;
  }
}
