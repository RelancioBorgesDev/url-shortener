import { Analytics } from "../../enterprise/entities/analytics.ts";

export interface AnalyticsRepository {
  create(analytics: Analytics): Promise<void>;
  findByUrlId(urlId: string): Promise<Analytics[]>;
}
