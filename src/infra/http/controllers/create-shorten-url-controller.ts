import { FastifyRequest, FastifyReply } from "fastify";
import { UrlRepository } from "../../database/repositories/drizzle-url-repository.ts";
import { CreateShortenUrlUseCase } from "../../../domain/urls/application/use-cases/create-shorten-url-use-case.ts";
import { CreateShortenUrlPresenter } from "../presenters/create-shorten-url-presenter.ts";

export async function createShortenUrlController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { url } = request.body as { url: string };

  const urlRepository = new UrlRepository();
  const createShortenUrl = new CreateShortenUrlUseCase(urlRepository);

  const result = await createShortenUrl.execute({ url });

  if (result.isLeft()) {
    return reply.status(400).send({ error: "Erro ao criar URL" });
  }

  return reply.status(201).send({
    result: CreateShortenUrlPresenter.toHTTP(result.value.shorten_url),
  });
}
