import request from "supertest";
import { createTestApp } from "../../helpers/create-app.ts";

describe("List Shorten URL - E2E", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeAll(async () => {
    app = createTestApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should list all shortened URLs", async () => {
    const response = await request(app.server).get("/api/links");

    expect(response.status).toBe(200);
  });
});
