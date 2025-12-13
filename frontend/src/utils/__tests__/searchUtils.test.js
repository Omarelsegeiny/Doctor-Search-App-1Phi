import {
  showEmptyQueryToast,
  performSearch,
  handleSearch,
} from "../searchUtils";

// Mock fetch
global.fetch = jest.fn();

// Mock document methods
document.getElementById = jest.fn();
document.body.appendChild = jest.fn();
document.body.contains = jest.fn();
document.body.removeChild = jest.fn();

describe("searchUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    // Reset DOM mocks
    document.getElementById.mockReturnValue(null);
    document.body.contains.mockReturnValue(true);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("showEmptyQueryToast", () => {
    it("should create and show a toast notification", () => {
      const createElementSpy = jest.spyOn(document, "createElement");
      const mockDiv = {
        id: "",
        innerText: "",
        style: {},
      };
      createElementSpy.mockReturnValue(mockDiv);

      showEmptyQueryToast();

      expect(createElementSpy).toHaveBeenCalledWith("div");
      expect(mockDiv.id).toBe("nltoast-div-bottom");
      expect(mockDiv.innerText).toBe("Please describe what you're looking for");
      expect(document.body.appendChild).toHaveBeenCalledWith(mockDiv);
    });

    it("should not create multiple toasts if one already exists", () => {
      const existingToast = { id: "nltoast-div-bottom" };
      document.getElementById.mockReturnValue(existingToast);

      const createElementSpy = jest.spyOn(document, "createElement");
      showEmptyQueryToast();

      expect(createElementSpy).not.toHaveBeenCalled();
    });

    it("should set correct styles on toast", () => {
      const mockDiv = {
        id: "",
        innerText: "",
        style: {},
      };
      jest.spyOn(document, "createElement").mockReturnValue(mockDiv);

      showEmptyQueryToast();

      expect(mockDiv.style.position).toBe("fixed");
      expect(mockDiv.style.bottom).toBe("-60px");
      expect(mockDiv.style.left).toBe("50%");
      expect(mockDiv.style.transform).toBe("translateX(-50%)");
      expect(mockDiv.style.background).toBe("#222");
      expect(mockDiv.style.color).toBe("#fff");
      expect(mockDiv.style.padding).toBe("1rem 2rem");
      expect(mockDiv.style.borderRadius).toBe("999px");
      expect(mockDiv.style.zIndex).toBe("9999");
    });
  });

  describe("performSearch", () => {
    it("should perform search and return results", async () => {
      const mockResponse = {
        results: [
          {
            npi: "1234567890",
            first_name: "John",
            last_name: "Doe",
            specialty: "Cardiology",
            city: "Chicago",
            state: "IL",
            zip: "60601",
          },
        ],
        message: null,
        isFallback: false,
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await performSearch("cardiologist", 12);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/search",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "cardiologist", limit: 12 }),
        }
      );

      expect(result).toEqual({
        results: mockResponse.results,
        message: null,
        isFallback: false,
      });
    });

    it("should handle fallback results", async () => {
      const mockResponse = {
        results: [
          {
            npi: "1234567890",
            first_name: "John",
            last_name: "Doe",
            specialty: "Cardiology",
            city: "Chicago",
            state: "IL",
            zip: "60601",
          },
        ],
        message: "We couldn't find any doctors matching your input.",
        isFallback: true,
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await performSearch("asdfghjkl");

      expect(result.isFallback).toBe(true);
      expect(result.message).toBeDefined();
    });

    it("should trim query before sending", async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ results: [], message: null, isFallback: false }),
      });

      await performSearch("  cardiologist  ", 12);

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/search",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "cardiologist", limit: 12 }),
        }
      );
    });

    it("should use default limit of 18", async () => {
      global.fetch.mockResolvedValueOnce({
        json: async () => ({ results: [], message: null, isFallback: false }),
      });

      await performSearch("cardiologist");

      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/search",
        expect.objectContaining({
          body: JSON.stringify({ query: "cardiologist", limit: 18 }),
        })
      );
    });
  });

  describe("handleSearch", () => {
    let mockSetters;

    beforeEach(() => {
      mockSetters = {
        setLoading: jest.fn(),
        setMessage: jest.fn(),
        setIsFallback: jest.fn(),
        setResults: jest.fn(),
        setError: jest.fn(),
      };
    });

    it("should show toast for empty query", () => {
      const createElementSpy = jest.spyOn(document, "createElement");
      const mockDiv = {
        id: "",
        innerText: "",
        style: {},
      };
      createElementSpy.mockReturnValue(mockDiv);

      handleSearch("", mockSetters);

      expect(createElementSpy).toHaveBeenCalled();
      expect(mockSetters.setLoading).not.toHaveBeenCalled();
    });

    it("should show toast for whitespace-only query", () => {
      const createElementSpy = jest.spyOn(document, "createElement");
      const mockDiv = {
        id: "",
        innerText: "",
        style: {},
      };
      createElementSpy.mockReturnValue(mockDiv);

      handleSearch("   ", mockSetters);

      expect(createElementSpy).toHaveBeenCalled();
      expect(mockSetters.setLoading).not.toHaveBeenCalled();
    });

    it("should set loading state and perform search", async () => {
      const mockResponse = {
        results: [
          {
            npi: "1234567890",
            first_name: "John",
            last_name: "Doe",
            specialty: "Cardiology",
            city: "Chicago",
            state: "IL",
            zip: "60601",
          },
        ],
        message: null,
        isFallback: false,
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const searchPromise = handleSearch("cardiologist", mockSetters);

      expect(mockSetters.setLoading).toHaveBeenCalledWith(true);
      expect(mockSetters.setMessage).toHaveBeenCalledWith(null);
      expect(mockSetters.setIsFallback).toHaveBeenCalledWith(false);
      expect(mockSetters.setError).toHaveBeenCalledWith(null);

      await searchPromise;

      expect(mockSetters.setResults).toHaveBeenCalledWith(mockResponse.results);
      expect(mockSetters.setMessage).toHaveBeenCalledWith(null);
      expect(mockSetters.setIsFallback).toHaveBeenCalledWith(false);
      expect(mockSetters.setLoading).toHaveBeenCalledWith(false);
    });

    it("should handle search errors", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      await handleSearch("cardiologist", mockSetters);

      expect(mockSetters.setError).toHaveBeenCalledWith(
        "Error fetching results"
      );
      expect(mockSetters.setLoading).toHaveBeenCalledWith(false);
    });

    it("should handle fallback results", async () => {
      const mockResponse = {
        results: [
          {
            npi: "1234567890",
            first_name: "John",
            last_name: "Doe",
            specialty: "Cardiology",
            city: "Chicago",
            state: "IL",
            zip: "60601",
          },
        ],
        message: "We couldn't find any doctors matching your input.",
        isFallback: true,
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await handleSearch("asdfghjkl", mockSetters);

      expect(mockSetters.setIsFallback).toHaveBeenCalledWith(true);
      expect(mockSetters.setMessage).toHaveBeenCalledWith(mockResponse.message);
    });

    it("should always set loading to false in finally block", async () => {
      global.fetch.mockRejectedValueOnce(new Error("Network error"));

      await handleSearch("cardiologist", mockSetters);

      expect(mockSetters.setLoading).toHaveBeenCalledWith(false);
    });
  });
});
