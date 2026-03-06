import client from "prom-client";
import { FastifyInstance } from "fastify";

const register = new client.Registry();

register.setDefaultLabels({
  app: "url-shortener",
});

client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

const httpRequestTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const urlClicks = new client.Counter({
  name: "url_shortener_clicks_total",
  help: "Total number of URL clicks",
});

const urlsCreated = new client.Counter({
  name: "url_shortener_urls_created_total",
  help: "Total number of shortened URLs created",
});

const cacheHits = new client.Counter({
  name: "url_shortener_cache_hits_total",
  help: "Total number of cache hits",
});

const cacheMisses = new client.Counter({
  name: "url_shortener_cache_misses_total",
  help: "Total number of cache misses",
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(urlClicks);
register.registerMetric(urlsCreated);
register.registerMetric(cacheHits);
register.registerMetric(cacheMisses);

export const metrics = {
  register,
  httpRequestDuration,
  httpRequestTotal,
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

export function startMetricsTimer(labels: Record<string, string>) {
  const end = httpRequestDuration.startTimer(labels);
  return () => end(labels);
}
