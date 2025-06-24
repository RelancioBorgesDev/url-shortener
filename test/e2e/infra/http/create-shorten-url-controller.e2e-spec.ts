import request from "supertest";
import { createTestApp } from "../../helpers/create-app.ts";

describe("Create Shorten URL - E2E", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeAll(async () => {
    app = createTestApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create a shortened URL", async () => {
    const response = await request(app.server)
      .post("/api/links")
      .send({ url: "https://google.com" });

    expect(response.status).toBe(201);
    expect(response.body.result).toMatchObject({
      originalUrl: "https://google.com",
      shortUrl: expect.stringContaining("http"),
      shortCode: expect.any(String),
      clicks: 0,
    });

    // Testes adicionais opcionais:
    expect(response.body.result.createdAt).toBeDefined();
    expect(response.body.result.expiresAt).toBeDefined();
    expect(response.body.result.id).toBeDefined();
  });
});
