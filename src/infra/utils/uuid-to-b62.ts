const BASE62_CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function encodeBase62(buffer: Uint8Array): string {
  let num = BigInt("0x" + Buffer.from(buffer).toString("hex"));
  let encoded = "";

  while (num > 0) {
    const remainder = Number(num % 62n);
    encoded = BASE62_CHARS[remainder] + encoded;
    num = num / 62n;
  }

  return encoded;
}
