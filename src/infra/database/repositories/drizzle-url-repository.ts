import { eq, sql } from "drizzle-orm";
import { UrlRepository as UrlInterface } from "../../../domain/urls/application/repositories/url-repository.ts";
import { Url } from "../../../domain/urls/enterprise/entities/url.ts";
import { db } from "../client.ts";
import { urls } from "../schema/urls.ts";
import { UniqueEntityID } from "../../../core/entities/unique-entity-id.ts";

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
      console.error("Erro ao buscar URLs:", err);
      throw err;
    }
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
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
    } catch (error) {
      console.error("Erro ao criar nova url:", error);
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
    } catch (error) {
      console.error("Erro ao incrementar os cliques:", error);
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

      return deleted.deletedId;
    } catch (error) {
      console.error("Erro ao deletar a URL:", error);
      throw new Error("Erro ao deletar a URL");
    }
  }
}
