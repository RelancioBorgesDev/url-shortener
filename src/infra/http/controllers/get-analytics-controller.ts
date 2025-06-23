import { FastifyRequest, FastifyReply } from "fastify";
import { UrlRepository } from "../../database/repositories/drizzle-url-repository.ts";
import { AnalyticsRepository } from "../../database/repositories/drizzle-analytics-repository.ts";
import { GetAnalyticsByShortCodeUseCase } from "../../../domain/urls/application/use-cases/get-analytics-by-shortcode-use-case.ts";

export async function getAnalyticsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { shortCode } = request.params as { shortCode: string };

  const urlRepository = new UrlRepository();
  const analyticsRepository = new AnalyticsRepository();

  const useCase = new GetAnalyticsByShortCodeUseCase(
    urlRepository,
    analyticsRepository
  );

  const result = await useCase.execute({ shortCode });

  if (result.isLeft()) {
    return reply.status(404).send({ error: result.value.message });
  }

  return reply.status(200).send(result.value);
}
