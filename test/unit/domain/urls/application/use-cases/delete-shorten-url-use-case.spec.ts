import { DeleteShortenUrlUseCase } from "../../../../../src/domain/urls/application/use-cases/delete-shorten-url-use-case.ts";
import { Url } from "../../../../../src/domain/urls/enterprise/entities/url.ts";
import { InMemoryUrlRepository } from "../../../../repositories/in-memory-url-repository.ts";

let inMemoryUrlRepository: InMemoryUrlRepository;
let sut: DeleteShortenUrlUseCase;

describe("Delete Shorten Url", () => {
  beforeAll(() => {
    inMemoryUrlRepository = new InMemoryUrlRepository();
    sut = new DeleteShortenUrlUseCase(inMemoryUrlRepository);
  });
  it("should delete an url with a valid short code", async () => {
    const url = Url.create({
      originalUrl: "http://example.com/test123",
      shortCode: "abc123",
      shortUrl: "https://sho.rt/abc123",
      clicks: 0,
      createdAt: new Date(),
    });

    await inMemoryUrlRepository.create(url);
    console.log(await inMemoryUrlRepository.findAllUrls());
    const result = await sut.execute({ shortCode: "abc123" });

    expect(result.isRight()).toBe(true);
  });
});
