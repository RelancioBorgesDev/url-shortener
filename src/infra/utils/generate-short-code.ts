import { randomUUID } from "node:crypto";
import { encodeBase62 } from "./uuid-to-b62.ts";

export function generateShortCode(length = 6): string {
  const uuid = randomUUID();
  const buffer = Buffer.from(uuid.replace(/-/g, ""), "hex");
  const base62 = encodeBase62(buffer);

  return base62.slice(0, length); 
}
