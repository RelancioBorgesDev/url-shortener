export abstract class Url {
  id: string; 
  originalUrl: string; 
  shortCode: string; 
  shortUrl: string; 
  clicks: number; 
  createdAt: Date; 
  expiresAt?: Date; 

  constructor(
    id: string,
    originalUrl: string,
    shortCode: string,
    shortUrl: string,
    clicks: number,
    createdAt: Date
  ) {
    this.id = id;
    this.originalUrl = originalUrl;
    this.shortCode = shortCode;
    this.shortUrl = shortUrl;
    this.clicks = clicks;
    this.createdAt = createdAt;
  }
}
