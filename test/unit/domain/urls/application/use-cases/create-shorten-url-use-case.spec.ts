import { CreateShortenUrlUseCase } from "../../../../../src/domain/urls/application/use-cases/create-shorten-url-use-case.ts";
import { InMemoryUrlRepository } from "../../../../repositories/in-memory-url-repository.ts";

let inMemoryUrlRepository: InMemoryUrlRepository;
let sut: CreateShortenUrlUseCase;

describe("Create Shorten Url", () => {
  beforeAll(() => {
    inMemoryUrlRepository = new InMemoryUrlRepository();
    sut = new CreateShortenUrlUseCase(inMemoryUrlRepository);
  });
  it("should create a new short URL with a valid short code", async () => {
    const url = "http://example.com/test123";
    const result = await sut.execute({ url });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const { shorten_url } = result.value;
      expect(shorten_url.originalUrl).toBe(url);
      expect(shorten_url.shortUrl).toMatch(/^https:\/\/sho\.rt\/\w+$/);
      expect(shorten_url.clicks).toBe(0);
      expect(shorten_url.shortCode.length).toBeGreaterThan(0);
    }
  });
});
