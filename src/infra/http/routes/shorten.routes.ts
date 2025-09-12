import { FastifyInstance } from "fastify";
import { createShortenUrlController } from "../controllers/create-shorten-url-controller.ts";
import { listShortenUrlsController } from "../controllers/list-shorten-urls-controller.ts";
import { deleteShortenUrlController } from "../controllers/delete-shorten-url-controller.ts";
import { z } from "zod";

export async function shortenRoutes(app: FastifyInstance) {
  app.post(
    "/api/links",
    {
      config: {
        rateLimit: {
          max: 20,
          timeWindow: "1 minute",
        },
      },
      schema: {
        description: "Create a new shorten URL",
        tags: ["Shorten"],
        body: z.object({
          url: z.string().url(),
        }),
        response: {
          201: z.object({
            url: z.object({
              id: z.string(),
              originalUrl: z.string(),
              shortUrl: z.string(),
              shortCode: z.string(),
              clicks: z.number(),
              createdAt: z.date(),
              expiresAt: z.date(),
            }),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    createShortenUrlController
  );
  app.get(
    "/api/links",
    {
      schema: {
        description: "List all shorten URLs",
        tags: ["Shorten"],
        response: {
          200: z.object({
            urls: z.array(
              z.object({
                id: z.string(),
                originalUrl: z.string(),
                shortUrl: z.string(),
                shortCode: z.string(),
                clicks: z.number(),
                createdAt: z.date(),
                expiresAt: z.date(),
              })
            ),
          }),
        },
      },
    },
    listShortenUrlsController
  );
  app.delete(
    "/api/links/:shortCode",
    {
      schema: {
        description: "Delete a shorten URL",
        tags: ["Shorten"],
        params: z.object({
          shortCode: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    deleteShortenUrlController
  );
}
