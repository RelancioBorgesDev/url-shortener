declare module "fastify-request-id" {
  import { FastifyInstance, FastifyRequest } from "fastify";
  import { FastifyPluginAsync } from "fastify";

  interface FastifyRequestIdOptions {
    headerName?: string;
    generator?: () => string;
  }

  const fastifyRequestId: FastifyPluginAsync<FastifyRequestIdOptions>;

  export default fastifyRequestId;

  export function getRequestId(request: FastifyRequest): string | undefined;
}
