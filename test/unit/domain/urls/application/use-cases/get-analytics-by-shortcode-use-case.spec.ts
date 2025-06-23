import { GetAnalyticsByShortCodeUseCase } from "../../../../../src/domain/urls/application/use-cases/get-analytics-by-shortcode-use-case.ts";
import { Analytics } from "../../../../../src/domain/urls/enterprise/entities/analytics.ts";
import { Url } from "../../../../../src/domain/urls/enterprise/entities/url.ts";
import { InMemoryAnalyticsRepository } from "../../../../repositories/in-memory-analytics-repository.ts";
import { InMemoryUrlRepository } from "../../../../repositories/in-memory-url-repository.ts";

let inMemoryUrlRepository: InMemoryUrlRepository;
let analyticsRepository: InMemoryAnalyticsRepository;
let sut: GetAnalyticsByShortCodeUseCase;

describe("GetAnalyticsByShortCodeUseCase", () => {
  beforeEach(() => {
    inMemoryUrlRepository = new InMemoryUrlRepository();
    analyticsRepository = new InMemoryAnalyticsRepository();
    sut = new GetAnalyticsByShortCodeUseCase(
      inMemoryUrlRepository,
      analyticsRepository
    );
  });

  it("should get the analytics by using the shortcode", async () => {
    const url = Url.create({
      originalUrl: "http://example.com/test123",
      shortCode: "abc123",
      shortUrl: "https://sho.rt/abc123",
      clicks: 0,
      createdAt: new Date(),
    });

    await inMemoryUrlRepository.create(url);

    const result = await sut.execute({ shortCode: url.shortCode });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.analytics).toEqual([]);
    }
  });

  it("should store and retrieve analytics by urlId", async () => {
    const url = Url.create({
      originalUrl: "http://example.com/test123",
      shortCode: "abc123",
      shortUrl: "https://sho.rt/abc123",
      clicks: 0,
      createdAt: new Date(),
    });

    await inMemoryUrlRepository.create(url);

    const analytics = Analytics.create({
      accessedAt: new Date(),
      country: "Brazil",
      ipAddress: "127.0.0.1",
      referrer: "https://google.com",
      urlId: url.id.toString(),
      userAgent: "Mozilla/5.0",
    });

    await analyticsRepository.create(analytics);

    const result = await sut.execute({ shortCode: url.shortCode });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.analytics.length).toBe(1);
      expect(result.value.analytics[0].country).toBe("Brazil");
    }
  });
});
