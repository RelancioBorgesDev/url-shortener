import { FastifyInstance } from "fastify";
import { redirectController } from "../controllers/redirect-controller.ts";
import { z } from "zod";

export async function redirectRoutes(app: FastifyInstance) {
  app.get(
    "/:shortCode",
    {
      config: {
        rateLimit: {
          max: 100,
          timeWindow: "10 seconds",
        },
      },
      schema: {
        description: "Redirect to original URL",
        tags: ["Redirect"],
        params: z.object({
          shortCode: z.string(),
        }),
        response: {
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    redirectController
  );
}
