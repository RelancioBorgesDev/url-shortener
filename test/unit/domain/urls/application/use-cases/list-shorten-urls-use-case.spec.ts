import { ListShortenUrlsUseCase } from "../../../../../src/domain/urls/application/use-cases/list-shorten-urls-use-case.ts";
import { Url } from "../../../../../src/domain/urls/enterprise/entities/url.ts";
import { InMemoryUrlRepository } from "../../../../repositories/in-memory-url-repository.ts";

let inMemoryUrlRepository: InMemoryUrlRepository;
let sut: ListShortenUrlsUseCase;

describe("List Shorten Urls Use Case Shorten Url", () => {
  beforeAll(() => {
    inMemoryUrlRepository = new InMemoryUrlRepository();
    sut = new ListShortenUrlsUseCase(inMemoryUrlRepository);
  });
  it("should return all shorten urls", async () => {
    const url = Url.create({
      originalUrl: "http://example.com/test123",
      shortCode: "abc123",
      shortUrl: "https://sho.rt/abc123",
      clicks: 0,
      createdAt: new Date(),
    });

    await inMemoryUrlRepository.create(url);
    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
  });
});
