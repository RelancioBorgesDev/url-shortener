export abstract class Analytics {
  id: string;
  url_id: string;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  country: string;
  accessedAt: Date;

  constructor(
    id: string,
    url_id: string,
    ipAdress: string,
    userAgent: string,
    referrer: string,
    country: string,
    acessedAt: Date
  ) {
    this.id = id;
    this.url_id = url_id;
    this.ipAddress = ipAdress;
    this.userAgent = userAgent;
    this.referrer = referrer;
    this.country = country;
    this.accessedAt = acessedAt;
  }
}
