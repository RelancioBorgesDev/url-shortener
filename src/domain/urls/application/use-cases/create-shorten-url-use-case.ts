// Fixed create-shorten-url-use-case.ts
import { Either, left, right } from "../../../../core/either.ts";
import { generateShortCode } from "../../../../infra/utils/generate-short-code.ts";
import { Url } from "../../enterprise/entities/url.ts";
import { UrlRepository } from "../repositories/url-repository.ts";

interface CreateShortenUrlUseCaseRequest {
  url: string;
}

type CreateShortenUrlUseCaseResponse = Either<
  { error: string },
  { shorten_url: Url }
>;

export class CreateShortenUrlUseCase {
  private urlRepository: UrlRepository;

  constructor(urlRepository: UrlRepository) {
    this.urlRepository = urlRepository;
  }

  private normalizeUrl(url: string): string {
    url = url.trim();
    if (!url.match(/^https?:\/\//i)) {
      url = "https://" + url;
    }
    return url;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  async execute({
    url,
  }: CreateShortenUrlUseCaseRequest): Promise<CreateShortenUrlUseCaseResponse> {
    try {
      const normalizedUrl = this.normalizeUrl(url);

      if (!this.isValidUrl(normalizedUrl)) {
        return left({ error: "URL inválida" });
      }

      const shortCode = generateShortCode();
      /* Se tiver um dominio configurado, usar ele no local do "localhost:3000" */
      const shortUrl = `http://localhost:3000/${shortCode}`;

      const shortenUrl = Url.create({
        originalUrl: normalizedUrl,
        shortUrl: shortUrl,
        shortCode: shortCode,
        clicks: 0,
        createdAt: new Date(),
      });

      await this.urlRepository.create(shortenUrl);
      return right({ shorten_url: shortenUrl });
    } catch (error) {
      console.error("Error creating shortened URL:", error);
      return left({ error: "Erro interno ao criar URL" });
    }
  }
}
