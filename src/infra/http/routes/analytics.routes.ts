import { FastifyInstance } from "fastify";
import { getAnalyticsController } from "../controllers/get-analytics-controller.ts";
import { z } from "zod";

export async function analyticsRoutes(app: FastifyInstance) {
  app.get(
    "/api/analytics/:shortCode",
    {
      schema: {
        description: "Get analytics by short code",
        tags: ["Analytics"],
        params: z.object({
          shortCode: z.string(),
        }),
        response: {
          200: z.object({
            totalClicks: z.number(),
            analytics: z.array(
              z.object({
                ipAddress: z.string(),
                userAgent: z.string(),
                referrer: z.string(),
                country: z.string(),
                accessedAt: z.date(),
              })
            ),
          }),
        },
        404: z.object({
          error: z.string(),
        }),
      },
    },
    getAnalyticsController
  );
}
