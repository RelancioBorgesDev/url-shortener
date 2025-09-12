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
import "dotenv/config";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyRateLimit from "@fastify/rate-limit";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
if (process.env.NODE_ENV === "development") {
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
  max: 1000,
  timeWindow: "1 minute",
  allowList: ["127.0.0.1"],
});

app.register(shortenRoutes);
app.register(analyticsRoutes);
app.register(redirectRoutes);

app.listen({ host: env.HOSTNAME, port: env.PORT }).then(() => {
  console.log("URL Shortcut HTTP Server running");
});
