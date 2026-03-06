import { FastifyInstance } from "fastify";
import { db } from "../../database/client.ts";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async (request, reply) => {
    try {
      await db.execute("SELECT 1");
      return reply.send({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    } catch (error) {
      return reply.status(503).send({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Database connection failed",
      });
    }
  });

  app.get("/health/live", async (request, reply) => {
    return reply.send({ status: "ok" });
  });

  app.get("/health/ready", async (request, reply) => {
    try {
      await db.execute("SELECT 1");
      return reply.send({ status: "ready" });
    } catch (error) {
      return reply.status(503).send({ status: "not ready" });
    }
  });
}
