import { FastifyInstance } from "fastify";
import { redirectController } from "../controllers/redirect-controller.ts";

export async function redirectRoutes(app: FastifyInstance) {
  app.get("/:shortCode", redirectController);
}
