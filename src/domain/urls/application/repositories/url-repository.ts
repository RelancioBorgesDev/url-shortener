import { Url } from "../../enterprise/entities/url.ts";

export interface UrlRepository {
  findByShortCode(code: string): Promise<Url | null>;
  findAllUrls(): Promise<Url[]>;
  create(url: Url): Promise<void>;
  incrementClicks(id: string): Promise<void>;
  deleteByShortCode(short_code: string): Promise<string>;
}
