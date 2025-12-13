import {
  buildGoogleSearchUrl,
  handleDoctorClick,
  calculateMaxCardWidth,
} from "../doctorUtils";

// Mock window.open
global.open = jest.fn();

describe("doctorUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("buildGoogleSearchUrl", () => {
    it("should build URL with all doctor information", () => {
      const doctor = {
        first_name: "John",
        last_name: "Doe",
        specialty: "Cardiology",
        city: "Chicago",
      };

      const url = buildGoogleSearchUrl(doctor);
      expect(url).toBe(
        "https://www.google.com/search?q=John+Doe+Cardiology+Chicago"
      );
    });

    it("should handle missing fields", () => {
      const doctor = {
        first_name: "John",
        last_name: "Doe",
        specialty: null,
        city: "Chicago",
      };

      const url = buildGoogleSearchUrl(doctor);
      expect(url).toBe("https://www.google.com/search?q=John+Doe+Chicago");
    });

    it("should handle empty strings", () => {
      const doctor = {
        first_name: "John",
        last_name: "",
        specialty: "Cardiology",
        city: "Chicago",
      };

      const url = buildGoogleSearchUrl(doctor);
      expect(url).toBe(
        "https://www.google.com/search?q=John+Cardiology+Chicago"
      );
    });

    it("should handle whitespace in names", () => {
      const doctor = {
        first_name: "John Michael",
        last_name: "Doe Smith",
        specialty: "Cardiology",
        city: "New York",
      };

      const url = buildGoogleSearchUrl(doctor);
      expect(url).toBe(
        "https://www.google.com/search?q=John+Michael+Doe+Smith+Cardiology+New+York"
      );
    });

    it("should trim whitespace from fields", () => {
      const doctor = {
        first_name: "  John  ",
        last_name: "  Doe  ",
        specialty: "  Cardiology  ",
        city: "  Chicago  ",
      };

      const url = buildGoogleSearchUrl(doctor);
      expect(url).toBe(
        "https://www.google.com/search?q=John+Doe+Cardiology+Chicago"
      );
    });
  });

  describe("handleDoctorClick", () => {
    it("should open Google search in new window", () => {
      const doctor = {
        first_name: "John",
        last_name: "Doe",
        specialty: "Cardiology",
        city: "Chicago",
      };

      handleDoctorClick(doctor);

      expect(global.open).toHaveBeenCalledTimes(1);
      expect(global.open).toHaveBeenCalledWith(
        "https://www.google.com/search?q=John+Doe+Cardiology+Chicago",
        "_blank",
        "noopener,noreferrer"
      );
    });
  });

  describe("calculateMaxCardWidth", () => {
    let mockMeasureText;

    beforeEach(() => {
      // Mock canvas context
      mockMeasureText = jest.fn((text) => ({
        width: text.length * 8, // Simple mock: 8px per character
      }));

      // Mock getContext before any tests run
      HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        measureText: mockMeasureText,
        font: "",
      }));

      // Mock createElement to return a canvas
      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, "createElement").mockImplementation((tagName) => {
        if (tagName === "canvas") {
          const canvas = originalCreateElement("canvas");
          canvas.getContext = jest.fn(() => ({
            measureText: mockMeasureText,
            font: "",
          }));
          return canvas;
        }
        return originalCreateElement(tagName);
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return null for empty array", () => {
      const result = calculateMaxCardWidth([]);
      expect(result).toBeNull();
    });

    it("should return null for null input", () => {
      const result = calculateMaxCardWidth(null);
      expect(result).toBeNull();
    });

    it("should return null for undefined input", () => {
      const result = calculateMaxCardWidth(undefined);
      expect(result).toBeNull();
    });

    it("should calculate width for single doctor", () => {
      const doctors = [
        {
          first_name: "John",
          last_name: "Doe",
          specialty: "Cardiology",
          city: "Chicago",
          state: "IL",
          zip: "60601",
        },
      ];

      const result = calculateMaxCardWidth(doctors);
      expect(result).toMatch(/\d+px/);
      expect(parseInt(result)).toBeGreaterThan(0);
    });

    it("should calculate width based on longest text", () => {
      const doctors = [
        {
          first_name: "John",
          last_name: "Doe",
          specialty: "Cardiology",
          city: "Chicago",
          state: "IL",
          zip: "60601",
        },
        {
          first_name: "Jane",
          last_name: "Smith",
          specialty: "Dermatology",
          city: "New York",
          state: "NY",
          zip: "10001",
        },
      ];

      const result = calculateMaxCardWidth(doctors);
      expect(result).toMatch(/\d+px/);
      expect(parseInt(result)).toBeGreaterThan(0);
    });

    it("should handle doctors with long names", () => {
      const doctors = [
        {
          first_name: "Very Long First Name",
          last_name: "Very Long Last Name",
          specialty: "Cardiology",
          city: "Chicago",
          state: "IL",
          zip: "60601",
        },
      ];

      const result = calculateMaxCardWidth(doctors);
      expect(result).toMatch(/\d+px/);
      expect(parseInt(result)).toBeGreaterThan(0);
    });
  });
});
