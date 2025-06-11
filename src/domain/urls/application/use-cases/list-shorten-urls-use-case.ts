import { Either, right } from "../../../../core/either.ts";
import { generateShortCode } from "../../../../infra/utils/generate-short-code.ts";
import { Url } from "../../enterprise/entities/url.ts";
import { UrlRepository } from "../repositories/url-repository.ts";

interface ListShortenUrlsUseCaseRequest {}

type ListShortenUrlsUseCaseResponse = Either<null, { urls: Array<Url> }>;

export class ListShortenUrlsUseCase {
  private urlRepository: UrlRepository;

  constructor(urlRepository: UrlRepository) {
    this.urlRepository = urlRepository;
  }

  async execute(): Promise<ListShortenUrlsUseCaseResponse> {
    const urls = await this.urlRepository.findAllUrls();
    return right({ urls });
  }
}
