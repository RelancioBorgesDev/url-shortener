import { FastifyRequest, FastifyReply } from "fastify";
import { UrlRepository } from "../../database/repositories/drizzle-url-repository.ts";
import { CreateShortenUrlUseCase } from "../../../domain/urls/application/use-cases/create-shorten-url-use-case.ts";
import { CreateShortenUrlPresenter } from "../presenters/create-shorten-url-presenter.ts";

export async function createShortenUrlController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { url } = request.body as { url: string };

    if (!url || typeof url !== "string" || url.trim() === "") {
      return reply.status(400).send({
        error: "URL é obrigatória",
      });
    }

    const urlRepository = new UrlRepository();
    const createShortenUrl = new CreateShortenUrlUseCase(urlRepository);
    const result = await createShortenUrl.execute({ url });

    if (result.isLeft()) {
      return reply.status(400).send({
        error: result.value.error,
      });
    }

    return reply.status(201).send({
      url: CreateShortenUrlPresenter.toHTTP(result.value.shorten_url),
    });
  } catch (error) {
    console.error("Error in createShortenUrlController:", error);
    return reply.status(500).send({
      error: "Erro interno do servidor",
    });
  }
}
