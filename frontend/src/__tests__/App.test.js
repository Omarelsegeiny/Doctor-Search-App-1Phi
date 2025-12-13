import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import * as searchUtils from "../utils/searchUtils";

// Mock the search utilities
jest.mock("../utils/searchUtils");

// Mock calculateMaxCardWidth to return a simple width
jest.mock("../utils/doctorUtils", () => ({
  ...jest.requireActual("../utils/doctorUtils"),
  calculateMaxCardWidth: jest.fn(() => "300px"),
}));

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    global.fetch = jest.fn();
  });

  it("should render page header and search form", () => {
    render(<App />);

    expect(screen.getByText("Find Your Doctor")).toBeInTheDocument();
    expect(
      screen.getByText("Describe what you're looking for")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        /I need a cardiologist who can do an ultrasound near downtown Chicago/i
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("should update query when typing in input", () => {
    render(<App />);

    const input = screen.getByPlaceholderText(
      /I need a cardiologist who can do an ultrasound near downtown Chicago/i
    );
    fireEvent.change(input, { target: { value: "cardiologist" } });

    expect(input).toHaveValue("cardiologist");
  });

  it("should call handleSearch when search button is clicked", () => {
    searchUtils.handleSearch.mockResolvedValue();
    render(<App />);

    const input = screen.getByPlaceholderText(
      /I need a cardiologist who can do an ultrasound near downtown Chicago/i
    );
    fireEvent.change(input, { target: { value: "cardiologist" } });

    const button = screen.getByRole("button", { name: /search/i });
    fireEvent.click(button);

    expect(searchUtils.handleSearch).toHaveBeenCalled();
  });

  it("should call handleSearch when Enter key is pressed", () => {
    searchUtils.handleSearch.mockResolvedValue();
    render(<App />);

    const input = screen.getByPlaceholderText(
      /I need a cardiologist who can do an ultrasound near downtown Chicago/i
    );
    fireEvent.change(input, { target: { value: "cardiologist" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(searchUtils.handleSearch).toHaveBeenCalled();
  });

  it("should not call handleSearch when Shift+Enter is pressed", () => {
    searchUtils.handleSearch.mockResolvedValue();
    render(<App />);

    const input = screen.getByPlaceholderText(
      /I need a cardiologist who can do an ultrasound near downtown Chicago/i
    );
    fireEvent.change(input, { target: { value: "cardiologist" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });

    expect(searchUtils.handleSearch).not.toHaveBeenCalled();
  });

  it("should show loading indicator during search", async () => {
    let resolveSearch;
    const searchPromise = new Promise((resolve) => {
      resolveSearch = resolve;
    });

    searchUtils.handleSearch.mockImplementation(async (query, setters) => {
      setters.setLoading(true);
      await searchPromise;
      setters.setLoading(false);
    });

    render(<App />);

    const input = screen.getByPlaceholderText(
      /I need a cardiologist who can do an ultrasound near downtown Chicago/i
    );
    fireEvent.change(input, { target: { value: "cardiologist" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    // Should show loading indicator
    await waitFor(() => {
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    resolveSearch();
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  it("should display search results", async () => {
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
        specialty: "Dermatology",
        city: "New York",
        state: "NY",
        zip: "10001",
      },
    ];

    searchUtils.handleSearch.mockImplementation(async (query, setters) => {
      setters.setResults(mockResults);
      setters.setMessage(null);
      setters.setIsFallback(false);
    });

    render(<App />);

    const input = screen.getByPlaceholderText(
      /I need a cardiologist who can do an ultrasound near downtown Chicago/i
    );
    fireEvent.change(input, { target: { value: "cardiologist" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("should display error message when search fails", async () => {
    searchUtils.handleSearch.mockImplementation(async (query, setters) => {
      setters.setError("Error fetching results");
    });

    render(<App />);

    const input = screen.getByPlaceholderText(
      /I need a cardiologist who can do an ultrasound near downtown Chicago/i
    );
    fireEvent.change(input, { target: { value: "cardiologist" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText("Error fetching results")).toBeInTheDocument();
    });
  });

  it("should display fallback message when isFallback is true", async () => {
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

    searchUtils.handleSearch.mockImplementation(async (query, setters) => {
      setters.setResults(mockResults);
      setters.setIsFallback(true);
      setters.setMessage("We couldn't find any doctors matching your input.");
    });

    render(<App />);

    const input = screen.getByPlaceholderText(
      /I need a cardiologist who can do an ultrasound near downtown Chicago/i
    );
    fireEvent.change(input, { target: { value: "asdfghjkl" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Showing popular specialties as suggestions:/i)
      ).toBeInTheDocument();
    });
  });

  it("should display error snackbar when search fails", async () => {
    searchUtils.handleSearch.mockImplementation(async (query, setters) => {
      setters.setError("Error fetching results");
    });

    render(<App />);

    const input = screen.getByPlaceholderText(
      /I need a cardiologist who can do an ultrasound near downtown Chicago/i
    );
    fireEvent.change(input, { target: { value: "cardiologist" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText("Error fetching results")).toBeInTheDocument();
    });

    // Snackbar should be visible
    const snackbar = screen
      .getByText("Error fetching results")
      .closest('[role="alert"]');
    expect(snackbar).toBeInTheDocument();
  });

  it("should not display results when there are no results", () => {
    render(<App />);

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });
});
