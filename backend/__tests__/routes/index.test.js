const request = require("supertest");
const app = require("../../src/index");

describe("GET /", () => {
  it("should return status message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("Backend is running");
  });
});
