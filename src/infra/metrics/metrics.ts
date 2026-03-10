import client from "prom-client";
import { FastifyInstance } from "fastify";

const register = new client.Registry();

register.setDefaultLabels({
  service: "url-shortener",
});

client.collectDefaultMetrics({ register });

const urlClicks = new client.Counter({
  name: "url_shortener_clicks_total",
  help: "Total number of URL clicks",
  labelNames: ["service"],
});

const urlsCreated = new client.Counter({
  name: "url_shortener_urls_created_total",
  help: "Total number of shortened URLs created",
  labelNames: ["service"],
});

const cacheHits = new client.Counter({
  name: "url_shortener_cache_hits_total",
  help: "Total number of cache hits",
  labelNames: ["service"],
});

const cacheMisses = new client.Counter({
  name: "url_shortener_cache_misses_total",
  help: "Total number of cache misses",
  labelNames: ["service"],
});

register.registerMetric(urlClicks);
register.registerMetric(urlsCreated);
register.registerMetric(cacheHits);
register.registerMetric(cacheMisses);

export const metrics = {
  register,
  urlClicks,
  urlsCreated,
  cacheHits,
  cacheMisses,
};

export async function metricsPlugin(fastify: FastifyInstance) {
  fastify.get("/metrics", async (request, reply) => {
    reply.header("Content-Type", register.contentType);
    return register.metrics();
  });
}
