import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "../env/env.ts";
import { shortenRoutes } from "./routes/shorten.routes.ts";
import { analyticsRoutes } from "./routes/analytics.routes.ts";
import { redirectRoutes } from "./routes/redirect.routes.ts";
import { healthRoutes } from "./routes/health.routes.ts";
import "dotenv/config";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyRequestId from "fastify-request-id";
import { metricsPlugin, metrics } from "../metrics/metrics.ts";
import { logger } from "../logging/logger.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyRequestId);

app.addHook("onRequest", async (request) => {
  logger.info("Incoming request", {
    requestId: request.id,
    method: request.method,
    url: request.url,
  });
});

app.addHook("onResponse", async (request, reply) => {
  if (request.url === '/metrics') return;

  const duration = reply.elapsedTime / 1000;
  
  let route = 'unknown';
  try {
    route = request.routeOptions?.url || request.url.split('?')[0] || 'unknown';
  } catch {
    route = request.url.split('?')[0] || 'unknown';
  }

  logger.info("Request completed", {
    requestId: request.id,
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    duration: `${duration.toFixed(3)}s`,
  });
});

app.addHook("onError", async (request, reply, error) => {
  logger.error("Request error", {
    requestId: request.id,
    method: request.method,
    url: request.url,
    error: error.message,
  });
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
if (env.NODE_ENV === "development") {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "URL Shortener API",
        description: "API para gerenciar URLs curtas",
        version: "1.0.0",
      },

      servers: [
        {
          url: "http://localhost:3333",
          description: "Development server",
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });
}
app.register(fastifyRateLimit, {
  max: env.RATE_LIMIT_MAX,
  timeWindow: env.RATE_LIMIT_TIME_WINDOW,
  allowList: ["127.0.0.1"],
});

app.register(metricsPlugin);
app.register(healthRoutes);
app.register(shortenRoutes);
app.register(analyticsRoutes);
app.register(redirectRoutes);

const start = async () => {
  try {
    await app.listen({ host: env.HOSTNAME, port: env.PORT });
    logger.info("Server started", { port: env.PORT, hostname: env.HOSTNAME });
  } catch (err) {
    logger.errorWithStack("Failed to start server", err as Error);
    process.exit(1);
  }
};

start();

const shutdown = async (signal: string) => {
  logger.info("Shutting down gracefully", { signal });
  await app.close();
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
