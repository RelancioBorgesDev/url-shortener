import { FastifyRequest, FastifyReply } from "fastify";
import { UrlRepository } from "../../database/repositories/drizzle-url-repository.ts";
import { ListShortenUrlsUseCase } from "../../../domain/urls/application/use-cases/list-shorten-urls-use-case.ts";
import { ListShortenUrlsPresenter } from "../presenters/list-shorten-urls-presenter.ts";

export async function listShortenUrlsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const urlRepository = new UrlRepository();
  const listShortenUrls = new ListShortenUrlsUseCase(urlRepository);

  const result = await listShortenUrls.execute();

  if (result.isLeft()) {
    return reply.status(400).send({ error: "Erro ao listar as URLs" });
  }

  return reply.status(201).send({
    result: ListShortenUrlsPresenter.toHTTP(result.value.urls),
  });
}
