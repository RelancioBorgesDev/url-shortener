import Fastify from "fastify";
import { createShortenUrlController } from "@/infra/http/controllers/create-shorten-url-controller.ts";
import { deleteShortenUrlController } from "@/infra/http/controllers/delete-shorten-url-controller.ts";
import { listShortenUrlsController } from "@/infra/http/controllers/list-shorten-urls-controller.ts";
import { getAnalyticsController } from "@/infra/http/controllers/get-analytics-controller.ts";

export function createTestApp() {
  const app = Fastify();

  app.post("/api/links", createShortenUrlController);
  app.get("/api/links", listShortenUrlsController);
  app.delete("/api/links/:shortCode", deleteShortenUrlController);

  app.get("/api/analytics/:shortCode", getAnalyticsController);

  return app;
}
