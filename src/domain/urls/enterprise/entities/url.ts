import { Entity } from "../../../../core/entities/entity.ts";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id.ts";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

interface UrlProps {
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
  expiresAt?: Date;
}

export class Url extends Entity<UrlProps> {
  get originalUrl(): string {
    return this.props.originalUrl;
  }

  get shortCode(): string {
    return this.props.shortCode;
  }

  get shortUrl(): string {
    return this.props.shortUrl;
  }

  get clicks(): number {
    return this.props.clicks;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  static create(props: Optional<UrlProps, "expiresAt">, id?: UniqueEntityID) {
    const now = new Date();

    const expiresAt =
      props.expiresAt ?? new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7); // 7 dias

    const newUrl = new Url(
      {
        ...props,
        expiresAt,
      },
      id
    );

    return newUrl;
  }
}
