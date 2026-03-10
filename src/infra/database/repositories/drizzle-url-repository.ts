import { eq, sql } from "drizzle-orm";
import { UrlRepository as UrlInterface } from "../../../domain/urls/application/repositories/url-repository.ts";
import { Url } from "../../../domain/urls/enterprise/entities/url.ts";
import { db } from "../client.ts";
import { urls } from "../schema/urls.ts";
import { UniqueEntityID } from "../../../core/entities/unique-entity-id.ts";
import { InMemoryCache } from "../../cache/in-memory-cache.ts";
import { metrics } from "../../metrics/metrics.ts";
import { logger } from "../../logging/logger.ts";

const urlCache = new InMemoryCache<Url>(300);

export class UrlRepository implements UrlInterface {
  async findAllUrls() {
    try {
      const results = await db.select().from(urls);

      return results.map((urlData) =>
        Url.create(
          {
            originalUrl: urlData.originalUrl,
            shortUrl: urlData.shortUrl,
            shortCode: urlData.shortCode,
            clicks: urlData.clicks,
            createdAt: urlData.createdAt!,
            expiresAt: urlData.expiresAt ?? undefined!,
          },
          new UniqueEntityID(urlData.id)
        )
      );
    } catch (err) {
      logger.error("Error fetching URLs", { error: err });
      throw err;
    }
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    const cached = urlCache.get(shortCode);
    if (cached) {
      metrics.cacheHits.inc({ service: "url-shortener" });
      return cached;
    }

    metrics.cacheMisses.inc({ service: "url-shortener" });

    const result = await db
      .select()
      .from(urls)
      .where(eq(urls.shortCode, shortCode));

    if (!result || result.length === 0) {
      return null;
    }

    const data = result[0];

    const url = Url.create(
      {
        originalUrl: data.originalUrl,
        shortUrl: data.shortUrl,
        shortCode: data.shortCode,
        clicks: data.clicks,
        createdAt: data.createdAt!,
        expiresAt: data.expiresAt ?? undefined!,
      },
      new UniqueEntityID(data.id)
    );

    urlCache.set(shortCode, url, 300);

    return url;
  }

  async create(url: Url) {
    try {
      const {
        originalUrl,
        id,
        clicks,
        createdAt,
        expiresAt,
        shortCode,
        shortUrl,
      } = url;
      await db.insert(urls).values({
        id: id.toString(),
        originalUrl: originalUrl,
        shortCode: shortCode,
        shortUrl: shortUrl,
        clicks: clicks,
        createdAt: createdAt,
        expiresAt: expiresAt,
      });
      metrics.urlsCreated.inc({ service: "url-shortener" });
    } catch (error) {
      logger.error("Error creating URL", { error });
      throw new Error("Erro ao criar nova url");
    }
  }

  async incrementClicks(id: string) {
    try {
      await db
        .update(urls)
        .set({
          clicks: sql`clicks + 1`,
        })
        .where(eq(urls.id, id));
      metrics.urlClicks.inc({ service: "url-shortener" });
    } catch (error) {
      logger.error("Error incrementing clicks", { error });
      throw new Error("Erro ao incrementar os cliques");
    }
  }

  async deleteByShortCode(shortCode: string) {
    try {
      const result = await db
        .delete(urls)
        .where(eq(urls.shortCode, shortCode))
        .returning({ deletedId: urls.id });

      const deleted = result[0];

      if (!deleted) {
        throw new Error("URL não encontrada");
      }

      urlCache.delete(shortCode);

      return deleted.deletedId;
    } catch (error) {
      logger.error("Error deleting URL", { error });
      throw new Error("Erro ao deletar a URL");
    }
  }
}
