const request = require("supertest");
const app = require("../../src/index");
const pool = require("../../src/db");

// Mock the database
jest.mock("../../src/db", () => ({
  query: jest.fn(),
}));

describe("POST /api/search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if query is missing", async () => {
    const response = await request(app).post("/api/search").send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Query is required");
  });

  it("should return 400 if query is empty", async () => {
    const response = await request(app).post("/api/search").send({ query: "" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Query is required");
  });

  it("should return 400 if query is only whitespace", async () => {
    const response = await request(app)
      .post("/api/search")
      .send({ query: "   " });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Query is required");
  });

  it("should sanitize negative limit to 1", async () => {
    const mockResults = [
      {
        npi: "1234567890",
        first_name: "John",
        last_name: "Doe",
        specialty: "Cardiology",
        city: "Chicago",
        state: "IL",
        zip: "60601",
      },
    ];

    // mysql2 returns [rows, fields]
    pool.query.mockResolvedValueOnce([mockResults, []]);

    const response = await request(app)
      .post("/api/search")
      .send({ query: "cardiologist", limit: -1 });

    // The controller sanitizes negative limits to 1, so it won't return 400
    expect(response.status).toBe(200);
  });

  it("should sanitize invalid limit to default", async () => {
    const mockResults = [
      {
        npi: "1234567890",
        first_name: "John",
        last_name: "Doe",
        specialty: "Cardiology",
        city: "Chicago",
        state: "IL",
        zip: "60601",
      },
    ];

    // mysql2 returns [rows, fields]
    pool.query.mockResolvedValueOnce([mockResults, []]);

    const response = await request(app)
      .post("/api/search")
      .send({ query: "cardiologist", limit: "invalid" });

    // The controller sanitizes invalid limits to 12 (default), so it won't return 400
    expect(response.status).toBe(200);
  });

  it("should return fallback results for gibberish queries", async () => {
    const mockFallbackResults = [
      {
        npi: "1234567890",
        first_name: "John",
        last_name: "Doe",
        specialty: "Cardiology",
        city: "Chicago",
        state: "IL",
        zip: "60601",
      },
    ];

    // mysql2 returns [rows, fields]
    pool.query.mockResolvedValueOnce([mockFallbackResults, []]);

    const response = await request(app)
      .post("/api/search")
      .send({ query: "asdfghjkl" });

    expect(response.status).toBe(200);
    expect(response.body.isFallback).toBe(true);
    expect(response.body.results).toBeDefined();
    expect(response.body.message).toBeDefined();
  });

  it("should return fallback results for very short queries", async () => {
    const mockFallbackResults = [
      {
        npi: "1234567890",
        first_name: "John",
        last_name: "Doe",
        specialty: "Cardiology",
        city: "Chicago",
        state: "IL",
        zip: "60601",
      },
    ];

    // mysql2 returns [rows, fields]
    pool.query.mockResolvedValueOnce([mockFallbackResults, []]);

    const response = await request(app)
      .post("/api/search")
      .send({ query: "ab" });

    expect(response.status).toBe(200);
    expect(response.body.isFallback).toBe(true);
  });

  it("should search for providers with valid query", async () => {
    const mockResults = [
      {
        npi: "1234567890",
        first_name: "John",
        last_name: "Doe",
        specialty: "Cardiology",
        city: "Chicago",
        state: "IL",
        zip: "60601",
      },
      {
        npi: "0987654321",
        first_name: "Jane",
        last_name: "Smith",
        specialty: "Cardiology",
        city: "Chicago",
        state: "IL",
        zip: "60602",
      },
    ];

    // mysql2 returns [rows, fields], so we need to mock it as an array
    pool.query.mockResolvedValueOnce([mockResults, []]);

    const response = await request(app)
      .post("/api/search")
      .send({ query: "cardiologist in Chicago" });

    expect(response.status).toBe(200);
    // isFallback is only set when returning fallback results, not for regular results
    expect(response.body.results).toHaveLength(2);
    expect(response.body.parsed).toBeDefined();
    expect(response.body.parsed.specialty).toBe("Cardiology");
  });

  it("should return empty results with message when no providers found", async () => {
    // mysql2 returns [rows, fields]
    pool.query.mockResolvedValueOnce([[], []]);

    const response = await request(app)
      .post("/api/search")
      .send({ query: "cardiologist in NonexistentCity" });

    expect(response.status).toBe(200);
    expect(response.body.results).toEqual([]);
    expect(response.body.message).toBeDefined();
    expect(response.body.isFallback).toBe(false);
  });

  it("should respect limit parameter", async () => {
    const mockResults = Array.from({ length: 20 }, (_, i) => ({
      npi: `123456789${i}`,
      first_name: "John",
      last_name: "Doe",
      specialty: "Cardiology",
      city: "Chicago",
      state: "IL",
      zip: "60601",
    }));

    // mysql2 returns [rows, fields]
    pool.query.mockResolvedValueOnce([mockResults, []]);

    const response = await request(app)
      .post("/api/search")
      .send({ query: "cardiologist", limit: 5 });

    expect(response.status).toBe(200);
    expect(response.body.results.length).toBeLessThanOrEqual(5);
  });

  it("should cap limit at 100", async () => {
    const mockResults = Array.from({ length: 200 }, (_, i) => ({
      npi: `123456789${i}`,
      first_name: "John",
      last_name: "Doe",
      specialty: "Cardiology",
      city: "Chicago",
      state: "IL",
      zip: "60601",
    }));

    // mysql2 returns [rows, fields]
    pool.query.mockResolvedValueOnce([mockResults, []]);

    const response = await request(app)
      .post("/api/search")
      .send({ query: "cardiologist", limit: 150 });

    expect(response.status).toBe(200);
    expect(response.body.results.length).toBeLessThanOrEqual(100);
  });

  it("should handle database errors gracefully", async () => {
    pool.query.mockRejectedValueOnce(new Error("Database connection failed"));

    const response = await request(app)
      .post("/api/search")
      .send({ query: "cardiologist" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Database connection failed");
  });

  it("should parse query and include parsed data in response", async () => {
    const mockResults = [
      {
        npi: "1234567890",
        first_name: "John",
        last_name: "Doe",
        specialty: "Cardiology",
        city: "Chicago",
        state: "IL",
        zip: "60601",
      },
    ];

    // mysql2 returns [rows, fields]
    pool.query.mockResolvedValueOnce([mockResults, []]);

    const response = await request(app)
      .post("/api/search")
      .send({ query: "cardiologist in Chicago Illinois who does ultrasounds" });

    expect(response.status).toBe(200);
    expect(response.body.parsed).toBeDefined();
    expect(response.body.parsed.specialty).toBe("Cardiology");
    expect(response.body.parsed.location).toBeDefined();
    expect(response.body.parsed.procedures).toBeDefined();
  });

  it("should handle fallback provider fetch failure gracefully", async () => {
    // Mock getFallbackProviders to fail
    pool.query.mockRejectedValueOnce(new Error("Fallback fetch failed"));

    const response = await request(app)
      .post("/api/search")
      .send({ query: "asdfghjkl" });

    expect(response.status).toBe(200);
    expect(response.body.isFallback).toBe(true);
    // Should return empty results but still respond successfully
    expect(response.body.results).toEqual([]);
    expect(response.body.message).toBeDefined();
  });
});
