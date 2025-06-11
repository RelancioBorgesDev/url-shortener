import { FastifyInstance } from "fastify";
import { createShortenUrlController } from "../controllers/create-shorten-url-controller.ts";
import { listShortenUrlsController } from "../controllers/list-shorten-urls-controller.ts";
import { deleteShortenUrlController } from "../controllers/delete-shorten-url-controller.ts";

export async function shortenRoutes(app: FastifyInstance) {
  app.post("/api/links", createShortenUrlController);
  app.get("/api/links", listShortenUrlsController);
  app.delete("/api/links/:shortCode", deleteShortenUrlController);
}
