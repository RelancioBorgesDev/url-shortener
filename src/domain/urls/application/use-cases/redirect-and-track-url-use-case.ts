import { UrlRepository } from "../repositories/url-repository.ts";
import { AnalyticsRepository } from "../repositories/analytics-repository.ts";
import { Analytics } from "../../enterprise/entities/analytics.ts";
import { Either, right } from "../../../../core/either.ts";

interface RedirectAndTrackUseCaseRequest {
  shortCode: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  country?: string;
}

type RedirectAndTrackUseCaseResponse = Either<
  null,
  {
    originalUrl: string;
  }
>;

export class RedirectAndTrackUseCase {
  constructor(
    private urlRepository: UrlRepository,
    private analyticsRepository: AnalyticsRepository
  ) {}

  async execute({
    shortCode,
    ipAddress,
    userAgent,
    referrer = "",
    country = "unknown",
  }: RedirectAndTrackUseCaseRequest): Promise<RedirectAndTrackUseCaseResponse> {
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url) {
      throw new Error("URL não encontrada");
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new Error("Essa URL expirou");
    }

    await this.urlRepository.incrementClicks(url.id.toString());

    const analytics = Analytics.create({
      urlId: url.id.toString(),
      ipAddress,
      userAgent,
      referrer,
      country,
      accessedAt: new Date(),
    });

    await this.analyticsRepository.create(analytics);

    return right({
      originalUrl: url.originalUrl,
    });
  }
}
