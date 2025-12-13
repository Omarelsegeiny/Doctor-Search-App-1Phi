const {
  getFallbackProviders,
  searchProviders,
} = require("../../src/services/providerService");
const pool = require("../../src/db");

// Mock the database
jest.mock("../../src/db", () => ({
  query: jest.fn(),
}));

describe("providerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getFallbackProviders", () => {
    it("should return providers for valid specialties", async () => {
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

      pool.query.mockResolvedValueOnce([mockResults, []]);

      const result = await getFallbackProviders(["Cardiology", "Dermatology"]);

      expect(result).toEqual(mockResults);
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE rndrng_prvdr_type IN"),
        expect.arrayContaining(["Cardiology", "Dermatology", 6])
      );
    });

    it("should throw error if specialties is not an array", async () => {
      await expect(getFallbackProviders("not an array")).rejects.toThrow(
        "Specialties must be a non-empty array"
      );
    });

    it("should throw error if specialties is empty array", async () => {
      await expect(getFallbackProviders([])).rejects.toThrow(
        "Specialties must be a non-empty array"
      );
    });

    it("should throw error if all specialties are invalid", async () => {
      await expect(
        getFallbackProviders(["", "   ", 123, null])
      ).rejects.toThrow("All specialties must be non-empty strings");
    });

    it("should filter out invalid specialties and use valid ones", async () => {
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

      pool.query.mockResolvedValueOnce([mockResults, []]);

      const result = await getFallbackProviders([
        "Cardiology",
        "",
        "   ",
        "Dermatology",
      ]);

      expect(result).toEqual(mockResults);
      // Should only use valid specialties
      const callArgs = pool.query.mock.calls[0];
      expect(callArgs[1]).toEqual(
        expect.arrayContaining(["Cardiology", "Dermatology", 6])
      );
    });

    it("should handle database errors", async () => {
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      await expect(getFallbackProviders(["Cardiology"])).rejects.toThrow(
        "Database error"
      );
    });

    it("should return empty array when no providers found", async () => {
      pool.query.mockResolvedValueOnce([[], []]);

      const result = await getFallbackProviders(["Cardiology"]);

      expect(result).toEqual([]);
    });
  });

  describe("searchProviders", () => {
    it("should search by specialty only", async () => {
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

      pool.query.mockResolvedValueOnce([mockResults, []]);

      const result = await searchProviders({ specialty: "Cardiology" }, 12);

      expect(result).toEqual(mockResults);
      expect(pool.query).toHaveBeenCalledTimes(1);
      const callArgs = pool.query.mock.calls[0];
      expect(callArgs[0]).toContain("WHERE");
      expect(callArgs[0]).toContain("rndrng_prvdr_type = ?");
      expect(callArgs[1]).toContain("Cardiology");
    });

    it("should search by city only", async () => {
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

      pool.query.mockResolvedValueOnce([mockResults, []]);

      const result = await searchProviders({ city: "Chicago" }, 12);

      expect(result).toEqual(mockResults);
      const callArgs = pool.query.mock.calls[0];
      expect(callArgs[0]).toContain("LOWER(rndrng_prvdr_city) LIKE ?");
      expect(callArgs[1]).toContain("%chicago%");
    });

    it("should search by state only", async () => {
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

      pool.query.mockResolvedValueOnce([mockResults, []]);

      const result = await searchProviders({ state: "IL" }, 12);

      expect(result).toEqual(mockResults);
      const callArgs = pool.query.mock.calls[0];
      expect(callArgs[0]).toContain("rndrng_prvdr_state_abrvtn = ?");
      expect(callArgs[1]).toContain("IL");
    });

    it("should search with multiple filters", async () => {
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

      pool.query.mockResolvedValueOnce([mockResults, []]);

      const result = await searchProviders(
        {
          specialty: "Cardiology",
          city: "Chicago",
          state: "IL",
        },
        12
      );

      expect(result).toEqual(mockResults);
      const callArgs = pool.query.mock.calls[0];
      expect(callArgs[0]).toContain("rndrng_prvdr_type = ?");
      expect(callArgs[0]).toContain("LOWER(rndrng_prvdr_city) LIKE ?");
      expect(callArgs[0]).toContain("rndrng_prvdr_state_abrvtn = ?");
      expect(callArgs[1]).toContain("Cardiology");
      expect(callArgs[1]).toContain("%chicago%");
      expect(callArgs[1]).toContain("IL");
    });

    it("should handle search with no filters", async () => {
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

      pool.query.mockResolvedValueOnce([mockResults, []]);

      const result = await searchProviders({}, 12);

      expect(result).toEqual(mockResults);
      const callArgs = pool.query.mock.calls[0];
      expect(callArgs[0]).not.toContain("WHERE");
    });

    it("should sanitize limit to minimum 1", async () => {
      const mockResults = [];
      pool.query.mockResolvedValueOnce([mockResults, []]);

      await searchProviders({ specialty: "Cardiology" }, -5);

      const callArgs = pool.query.mock.calls[0];
      const limitParam = callArgs[1][callArgs[1].length - 1];
      expect(limitParam).toBeGreaterThanOrEqual(1);
    });

    it("should sanitize limit to maximum 500", async () => {
      const mockResults = [];
      pool.query.mockResolvedValueOnce([mockResults, []]);

      await searchProviders({ specialty: "Cardiology" }, 1000);

      const callArgs = pool.query.mock.calls[0];
      const limitParam = callArgs[1][callArgs[1].length - 1];
      expect(limitParam).toBeLessThanOrEqual(500);
    });

    it("should use default limit of 12 if limit is invalid", async () => {
      const mockResults = [];
      pool.query.mockResolvedValueOnce([mockResults, []]);

      await searchProviders({ specialty: "Cardiology" }, "invalid");

      const callArgs = pool.query.mock.calls[0];
      const limitParam = callArgs[1][callArgs[1].length - 1];
      // Should use default 12, but multiplied by 3 for queryLimit
      expect(limitParam).toBe(36);
    });

    it("should ignore non-string filter values", async () => {
      const mockResults = [];
      pool.query.mockResolvedValueOnce([mockResults, []]);

      await searchProviders(
        {
          specialty: 123,
          city: null,
          state: undefined,
        },
        12
      );

      const callArgs = pool.query.mock.calls[0];
      // Should not include non-string values in WHERE clause
      expect(callArgs[0]).not.toContain("WHERE");
    });

    it("should handle database errors", async () => {
      pool.query.mockRejectedValueOnce(new Error("Database connection failed"));

      await expect(
        searchProviders({ specialty: "Cardiology" }, 12)
      ).rejects.toThrow("Database connection failed");
    });

    it("should return empty array when no results found", async () => {
      pool.query.mockResolvedValueOnce([[], []]);

      const result = await searchProviders({ specialty: "Cardiology" }, 12);

      expect(result).toEqual([]);
    });

    it("should use queryLimit of 3x sanitizedLimit up to 500", async () => {
      const mockResults = [];
      pool.query.mockResolvedValueOnce([mockResults, []]);

      await searchProviders({ specialty: "Cardiology" }, 10);

      const callArgs = pool.query.mock.calls[0];
      const limitParam = callArgs[1][callArgs[1].length - 1];
      // 10 * 3 = 30
      expect(limitParam).toBe(30);
    });

    it("should handle city filter with case-insensitive matching", async () => {
      const mockResults = [];
      pool.query.mockResolvedValueOnce([mockResults, []]);

      await searchProviders({ city: "CHICAGO" }, 12);

      const callArgs = pool.query.mock.calls[0];
      // Should convert to lowercase for LIKE pattern
      expect(callArgs[1]).toContain("%chicago%");
    });
  });
});
