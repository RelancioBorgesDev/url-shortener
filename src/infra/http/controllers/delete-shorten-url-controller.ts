import { FastifyRequest, FastifyReply } from "fastify";
import { UrlRepository } from "../../database/repositories/drizzle-url-repository.ts";
import { DeleteShortenUrlUseCase } from "../../../domain/urls/application/use-cases/delete-shorten-url-use-case.ts";

export async function deleteShortenUrlController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { shortCode } = request.params as { shortCode: string };

  const urlRepository = new UrlRepository();
  const deleteShortenUrl = new DeleteShortenUrlUseCase(urlRepository);

  const result = await deleteShortenUrl.execute({ shortCode });

  if (result.isLeft()) {
    const error = (result as { value: { message: string } }).value;
    return reply.status(404).send({ error: error.message });
  }

  const success = (result as { value: { message: string } }).value;
  return reply.status(200).send({ result: success.message });
}
