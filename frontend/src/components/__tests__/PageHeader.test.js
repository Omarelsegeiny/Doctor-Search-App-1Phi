import { render, screen } from "@testing-library/react";
import PageHeader from "../PageHeader";

describe("PageHeader", () => {
  it("should render main heading", () => {
    render(<PageHeader />);

    expect(screen.getByText("Find Your Doctor")).toBeInTheDocument();
  });

  it("should render subtitle", () => {
    render(<PageHeader />);

    expect(
      screen.getByText("Describe what you're looking for")
    ).toBeInTheDocument();
  });
});
