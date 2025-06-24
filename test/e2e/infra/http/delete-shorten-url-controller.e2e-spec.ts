import request from "supertest";
import { createTestApp } from "../../helpers/create-app.ts";

describe("Delete Shorten URL - E2E", () => {
  let app: Awaited<ReturnType<typeof createTestApp>>;

  beforeAll(async () => {
    app = createTestApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should delete a shortened URL", async () => {
    const createResponse = await request(app.server)
      .post("/api/links")
      .send({ url: "https://google.com" });

    const { shortCode } = createResponse.body.result;

    const deleteResponse = await request(app.server).delete(
      `/api/links/${shortCode}`
    );

    expect(deleteResponse.status).toBe(200);

    const findResponse = await request(app.server).get(
      `/api/links/${shortCode}`
    );

    expect(findResponse.status).toBe(404);
  });
});
