import Fastify from "fastify";
import { createShortenUrlController } from "../../../src/infra/http/controllers/create-shorten-url-controller.ts";

export function createTestApp() {
  const app = Fastify();

  app.post("/shorten", createShortenUrlController);

  return app;
}
