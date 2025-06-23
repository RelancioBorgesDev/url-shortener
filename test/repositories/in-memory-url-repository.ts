import { UniqueEntityID } from "../../src/core/entities/unique-entity-id.ts";
import { UrlRepository } from "../../src/domain/urls/application/repositories/url-repository.ts";
import { Url } from "../../src/domain/urls/enterprise/entities/url.ts";

export class InMemoryUrlRepository implements UrlRepository {
  public items: Url[] = [];

  async findByShortCode(code: string) {
    const url = await this.items.find((item) => item.shortCode === code);
    if (!url) {
      throw Error("Url not found");
    }
    return url;
  }
  async findAllUrls(): Promise<Url[]> {
    return await this.items.map((item) => {
      return Url.create(
        {
          originalUrl: item.originalUrl,
          clicks: item.clicks,
          createdAt: item.createdAt,
          shortCode: item.shortCode,
          shortUrl: item.shortUrl,
          expiresAt: item.expiresAt,
        },
        new UniqueEntityID(item.id.toString())
      );
    });
  }
  async create(url: Url): Promise<void> {
    const newUrl = Url.create(
      {
        originalUrl: url.originalUrl,
        clicks: url.clicks,
        createdAt: url.createdAt,
        shortCode: url.shortCode,
        shortUrl: url.shortUrl,
        expiresAt: url.expiresAt,
      },
      new UniqueEntityID(url.id.toString())
    );

    this.items.push(newUrl);
  }

  async incrementClicks(id: string): Promise<void> {
    const newId = new UniqueEntityID(id);

    const index = this.items.findIndex((item) => item.id.equals(newId));
    if (index === -1) {
      throw new Error("Url not found");
    }

    const url = this.items[index];

    const updatedUrl = Url.create(
      {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: url.shortUrl,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        clicks: url.clicks + 1,
      },
      url.id
    );

    this.items[index] = updatedUrl;
  }

  async deleteByShortCode(short_code: string): Promise<string> {
    const initialLength = this.items.length;

    this.items = this.items.filter((item) => item.shortCode !== short_code);

    if (this.items.length === initialLength) {
      throw new Error("Url not found");
    }

    return "Deletado com sucesso";
  }
}
