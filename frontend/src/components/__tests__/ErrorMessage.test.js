import { render, screen } from "@testing-library/react";
import ErrorMessage from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("should not render when message is null", () => {
    const { container } = render(<ErrorMessage message={null} />);

    expect(container.firstChild).toBeNull();
  });

  it("should not render when message is undefined", () => {
    const { container } = render(<ErrorMessage />);

    expect(container.firstChild).toBeNull();
  });

  it("should render error message when provided", () => {
    render(<ErrorMessage message="Error occurred" />);

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("should render different error messages", () => {
    const { rerender } = render(<ErrorMessage message="First error" />);

    expect(screen.getByText("First error")).toBeInTheDocument();

    rerender(<ErrorMessage message="Second error" />);

    expect(screen.getByText("Second error")).toBeInTheDocument();
    expect(screen.queryByText("First error")).not.toBeInTheDocument();
  });
});
