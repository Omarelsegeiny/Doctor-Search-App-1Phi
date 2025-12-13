import { render, screen, fireEvent } from "@testing-library/react";
import SearchForm from "../SearchForm";

describe("SearchForm", () => {
  const mockProps = {
    query: "",
    onQueryChange: jest.fn(),
    onKeyDown: jest.fn(),
    onSearch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render search input and button", () => {
    render(<SearchForm {...mockProps} />);

    expect(
      screen.getByPlaceholderText(
        /I need a cardiologist who can do an ultrasound near downtown Chicago/i
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("should display query value in input", () => {
    render(<SearchForm {...mockProps} query="cardiologist" />);

    const input = screen.getByPlaceholderText(
      /I need a cardiologist who can do an ultrasound near downtown Chicago/i
    );
    expect(input).toHaveValue("cardiologist");
  });

  it("should call onQueryChange when input changes", () => {
    render(<SearchForm {...mockProps} />);

    const input = screen.getByPlaceholderText(
      /I need a cardiologist who can do an ultrasound near downtown Chicago/i
    );
    fireEvent.change(input, { target: { value: "new query" } });

    expect(mockProps.onQueryChange).toHaveBeenCalledTimes(1);
  });

  it("should call onKeyDown when key is pressed", () => {
    render(<SearchForm {...mockProps} />);

    const input = screen.getByPlaceholderText(
      /I need a cardiologist who can do an ultrasound near downtown Chicago/i
    );
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockProps.onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("should call onSearch when button is clicked", () => {
    render(<SearchForm {...mockProps} />);

    const button = screen.getByRole("button", { name: /search/i });
    fireEvent.click(button);

    expect(mockProps.onSearch).toHaveBeenCalledTimes(1);
  });
});
