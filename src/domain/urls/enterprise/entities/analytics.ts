import { Entity } from "../../../../core/entities/entity.ts";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id.ts";

interface AnalyticsProps {
  urlId: string;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  country: string;
  accessedAt: Date;
}

export class Analytics extends Entity<AnalyticsProps> {
  get urlId(): string {
    return this.props.urlId;
  }

  get ipAddress(): string {
    return this.props.ipAddress;
  }

  get userAgent(): string {
    return this.props.userAgent;
  }

  get referrer(): string {
    return this.props.referrer;
  }

  get country(): string {
    return this.props.country;
  }

  get accessedAt(): Date {
    return this.props.accessedAt;
  }

  static create(props: AnalyticsProps, id?: UniqueEntityID) {
    return new Analytics(props, id);
  }
}
