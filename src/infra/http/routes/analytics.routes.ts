import { FastifyInstance } from "fastify";
import { getAnalyticsController } from "../controllers/get-analytics-controller.ts";

export async function analyticsRoutes(app: FastifyInstance) {
  app.get("/api/analytics/:shortCode", getAnalyticsController);
}
