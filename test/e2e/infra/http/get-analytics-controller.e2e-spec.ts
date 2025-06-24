import request from "supertest";
import { createTestApp } from "../../helpers/create-app.ts";

describe("Get Analytics Controller - E2E", () => {
  let app: ReturnType<typeof createTestApp>;

  beforeAll(async () => {
    app = createTestApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should list all shortened URLs", async () => {
    const createResponse = await request(app.server)
      .post("/api/links")
      .send({ url: "https://google.com" });

    const { shortCode } = createResponse.body.result;

    const response = await request(app.server).get(
      `/api/analytics/${shortCode}`
    );

    expect(response.status).toBe(200);
  });
});
