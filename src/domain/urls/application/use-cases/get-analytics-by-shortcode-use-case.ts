import { UrlRepository } from "../repositories/url-repository.ts";
import { AnalyticsRepository } from "../repositories/analytics-repository.ts";
import { Either, right, left } from "../../../../core/either.ts";

type GetAnalyticsByShortCodeRequest = {
  shortCode: string;
};

type GetAnalyticsByShortCodeResponse = Either<
  { message: string },
  {
    totalClicks: number;
    analytics: {
      ipAddress: string;
      userAgent: string;
      referrer: string;
      country: string;
      accessedAt: Date;
    }[];
  }
>;

export class GetAnalyticsByShortCodeUseCase {
  constructor(
    private urlRepository: UrlRepository,
    private analyticsRepository: AnalyticsRepository
  ) {}

  async execute({
    shortCode,
  }: GetAnalyticsByShortCodeRequest): Promise<GetAnalyticsByShortCodeResponse> {
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url) {
      return left({ message: "URL não encontrada" });
    }

    const analytics = await this.analyticsRepository.findByUrlId(
      url.id.toString()
    );

    return right({
      totalClicks: url.clicks,
      analytics: analytics.map((a) => ({
        ipAddress: a.ipAddress,
        userAgent: a.userAgent,
        referrer: a.referrer,
        country: a.country,
        accessedAt: a.accessedAt,
      })),
    });
  }
}
