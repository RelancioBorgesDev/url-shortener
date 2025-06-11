import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import "dotenv/config";
import { env } from "../env/env.ts";
import { shortenRoutes } from "./routes/shorten.routes.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(shortenRoutes);

app.listen({ host: env.HOSTNAME, port: env.PORT }).then(() => {
  console.log("URL Shortcut HTTP Server running");
});
