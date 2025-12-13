import { render, screen } from "@testing-library/react";
import FallbackMessage from "../FallbackMessage";

describe("FallbackMessage", () => {
  it("should not render when show is false", () => {
    const { container } = render(<FallbackMessage show={false} />);

    expect(container.firstChild).toBeNull();
  });

  it("should not render when show is undefined", () => {
    const { container } = render(<FallbackMessage />);

    expect(container.firstChild).toBeNull();
  });

  it("should render message when show is true", () => {
    render(<FallbackMessage show={true} />);

    expect(
      screen.getByText(/Showing popular specialties as suggestions:/i)
    ).toBeInTheDocument();
  });
});
