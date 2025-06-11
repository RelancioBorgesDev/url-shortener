import { Either, right, left } from "../../../../core/either.ts";
import { UrlRepository } from "../repositories/url-repository.ts";

interface DeleteShortenUrlUseCaseRequest {
  shortCode: string;
}

type DeleteShortenUrlUseCaseResponse = Either<
  { message: string }, // erro
  { message: string } // sucesso
>;

export class DeleteShortenUrlUseCase {
  constructor(private urlRepository: UrlRepository) {}

  async execute({
    shortCode,
  }: DeleteShortenUrlUseCaseRequest): Promise<DeleteShortenUrlUseCaseResponse> {
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url) {
      return left<{ message: string }, never>({
        message: "URL não encontrada",
      });
    }

    await this.urlRepository.deleteByShortCode(shortCode);

    return right<never, { message: string }>({
      message: "URL deletada com sucesso",
    });
  }
}
