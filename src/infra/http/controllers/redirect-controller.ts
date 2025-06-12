import { FastifyRequest, FastifyReply } from "fastify";
import { UrlRepository } from "../../database/repositories/drizzle-url-repository.ts";
import { RedirectAndTrackUseCase } from "../../../domain/urls/application/use-cases/redirect-and-track-url-use-case.ts";
import { AnalyticsRepository } from "../../database/repositories/drizzle-analytics-repository.ts";

export async function redirectController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { shortCode } = request.params as { shortCode: string };

  const ipAddress =
    request.headers["x-forwarded-for"]?.toString() || request.ip;

  const userAgent = request.headers["user-agent"] || "unknown";
  const referrer = request.headers["referer"] || "";

  const rawCountry = request.headers["x-country"];
  const country = Array.isArray(rawCountry)
    ? rawCountry[0]
    : rawCountry || "unknown";

  const urlRepository = new UrlRepository();
  const analyticsRepository = new AnalyticsRepository();

  const useCase = new RedirectAndTrackUseCase(
    urlRepository,
    analyticsRepository
  );

  const result = await useCase.execute({
    shortCode,
    ipAddress,
    userAgent,
    referrer,
    country,
  });

  if (result.isLeft()) {
    return reply.status(404).send({ error: "URL não encontrada ou expirada" });
  }

  return reply.status(302).redirect(result.value.originalUrl);
}
