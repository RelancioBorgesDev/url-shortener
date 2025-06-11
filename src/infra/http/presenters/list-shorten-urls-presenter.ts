import { Url } from "../../../domain/urls/enterprise/entities/url.ts";

export class ListShortenUrlsPresenter {
  static toHTTP(urls: Url[]) {
    return urls.map((url) => ({
      id: url.id.toString(),
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    }));
  }
}
