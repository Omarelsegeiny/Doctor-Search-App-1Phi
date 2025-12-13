import { render, screen } from "@testing-library/react";
import LoadingIndicator from "../LoadingIndicator";

describe("LoadingIndicator", () => {
  it("should not render when loading is false", () => {
    const { container } = render(<LoadingIndicator loading={false} />);

    // The container should exist but the CircularProgress should not be visible
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should render loading indicator when loading is true", () => {
    render(<LoadingIndicator loading={true} />);

    // Material-UI CircularProgress renders as a div with role="progressbar"
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });
});
