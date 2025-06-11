import { Either, right } from "../../../../core/either.ts";
import { generateShortCode } from "../../../../infra/utils/generate-short-code.ts";
import { Url } from "../../enterprise/entities/url.ts";
import { UrlRepository } from "../repositories/url-repository.ts";

interface CreateShortenUrlUseCaseRequest {
  url: string;
}

type CreateShortenUrlUseCaseResponse = Either<null, { shorten_url: Url }>;

export class CreateShortenUrlUseCase {
  private urlRepository: UrlRepository;

  constructor(urlRepository: UrlRepository) {
    this.urlRepository = urlRepository;
  }

  async execute({
    url,
  }: CreateShortenUrlUseCaseRequest): Promise<CreateShortenUrlUseCaseResponse> {
    const shortCode = generateShortCode();
    const shortUrl = `https://sho.rt/${shortCode}`;

    const shortenUrl = Url.create({
      originalUrl: url,
      shortUrl: shortUrl,
      shortCode: shortCode,
      clicks: 0,
      createdAt: new Date(),
    });

    await this.urlRepository.create(shortenUrl);

    return right({ shorten_url: shortenUrl });
  }
}
