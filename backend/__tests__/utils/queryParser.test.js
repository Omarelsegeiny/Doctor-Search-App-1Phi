const {
  parseQuery,
  hasMeaningfulInfo,
  isLikelyGibberish,
} = require("../../src/utils/queryParser");

describe("queryParser", () => {
  describe("parseQuery", () => {
    it("should extract specialty from query", () => {
      const result = parseQuery("I need a cardiologist");
      expect(result.specialty).toBe("Cardiology");
    });

    it("should extract multiple specialties and use first match", () => {
      const result = parseQuery("I need a cardiologist or dermatologist");
      expect(result.specialty).toBe("Cardiology");
    });

    it("should extract city from query", () => {
      const result = parseQuery("I need a doctor in Chicago");
      expect(result.location.city).toBe("Chicago");
    });

    it("should extract state from query", () => {
      const result = parseQuery("I need a doctor in Illinois");
      expect(result.location.state).toBe("IL");
    });

    it("should extract procedures from query", () => {
      const result = parseQuery("I need an ultrasound");
      expect(result.procedures).toContain("ultrasound");
    });

    it("should extract multiple procedures", () => {
      const result = parseQuery("I need an ultrasound and MRI");
      expect(result.procedures.length).toBeGreaterThan(0);
      expect(result.procedures).toContain("ultrasound");
      expect(result.procedures).toContain("mri");
    });

    it("should extract complex query with all fields", () => {
      const result = parseQuery(
        "I need a cardiologist in Chicago Illinois who does ultrasounds"
      );
      expect(result.specialty).toBe("Cardiology");
      expect(result.location.city).toBe("Chicago");
      expect(result.location.state).toBe("IL");
      expect(result.procedures).toContain("ultrasound");
    });

    it("should handle queries with location keywords", () => {
      const result = parseQuery("I need a doctor near downtown Chicago");
      expect(result.location.keyword).toBe("near");
      expect(result.location.city).toBe("Chicago");
    });

    it("should preserve original query", () => {
      const query = "I need a cardiologist";
      const result = parseQuery(query);
      expect(result.originalQuery).toBe(query);
    });

    it("should handle empty query", () => {
      const result = parseQuery("");
      expect(result.specialty).toBeNull();
      expect(result.location.city).toBeNull();
      expect(result.procedures).toEqual([]);
    });

    it("should handle case-insensitive queries", () => {
      const result = parseQuery("I NEED A CARDIOLOGIST");
      expect(result.specialty).toBe("Cardiology");
    });

    it("should extract specialty from various formats", () => {
      expect(parseQuery("cardiologist").specialty).toBe("Cardiology");
      expect(parseQuery("cardiology").specialty).toBe("Cardiology");
      expect(parseQuery("heart doctor").specialty).toBe("Cardiology");
    });
  });

  describe("hasMeaningfulInfo", () => {
    it("should return true if specialty is present", () => {
      const parsed = {
        specialty: "Cardiology",
        location: { city: null, state: null },
        procedures: [],
      };
      expect(hasMeaningfulInfo(parsed)).toBe(true);
    });

    it("should return true if location is present", () => {
      const parsed = {
        specialty: null,
        location: { city: "Chicago", state: null },
        procedures: [],
      };
      expect(hasMeaningfulInfo(parsed)).toBe(true);
    });

    it("should return true if procedures are present", () => {
      const parsed = {
        specialty: null,
        location: { city: null, state: null },
        procedures: ["ultrasound"],
      };
      expect(hasMeaningfulInfo(parsed)).toBe(true);
    });

    it("should return false if no meaningful info", () => {
      const parsed = {
        specialty: null,
        location: { city: null, state: null },
        procedures: [],
      };
      expect(hasMeaningfulInfo(parsed)).toBe(false);
    });

    it("should return true if state is present", () => {
      const parsed = {
        specialty: null,
        location: { city: null, state: "IL" },
        procedures: [],
      };
      expect(hasMeaningfulInfo(parsed)).toBe(true);
    });
  });

  describe("isLikelyGibberish", () => {
    it("should return true for very short queries", () => {
      expect(isLikelyGibberish("ab")).toBe(true);
      expect(isLikelyGibberish("a")).toBe(true);
    });

    it("should return false for meaningful short queries", () => {
      expect(isLikelyGibberish("cardiology")).toBe(false);
      expect(isLikelyGibberish("doctor")).toBe(false);
    });

    it("should return true for mostly numbers", () => {
      expect(isLikelyGibberish("12345")).toBe(true);
      expect(isLikelyGibberish("123 456 789")).toBe(true);
    });

    it("should return true for mostly special characters", () => {
      expect(isLikelyGibberish("!!!@@@###")).toBe(true);
      expect(isLikelyGibberish("@#$%^&*()")).toBe(true);
    });

    it("should return false for normal queries", () => {
      expect(isLikelyGibberish("I need a cardiologist")).toBe(false);
      expect(isLikelyGibberish("doctor in chicago")).toBe(false);
    });

    it("should return true for queries with low letter ratio", () => {
      // 3 letters out of 13 = 23% < 30% threshold
      expect(isLikelyGibberish("1234567890abc")).toBe(true);
      // 2 letters out of 10 = 20% < 30% threshold
      expect(isLikelyGibberish("12345678ab")).toBe(true);
    });

    it("should handle empty strings", () => {
      expect(isLikelyGibberish("")).toBe(true);
      expect(isLikelyGibberish("   ")).toBe(true);
    });
  });
});
