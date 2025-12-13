import { render, screen } from "@testing-library/react";
import DoctorCard from "../DoctorCard";

// Mock the handleDoctorClick function
jest.mock("../../utils/doctorUtils", () => ({
  handleDoctorClick: jest.fn(),
}));

describe("DoctorCard", () => {
  const mockDoctor = {
    npi: "1234567890",
    first_name: "John",
    last_name: "Doe",
    specialty: "Cardiology",
    city: "Chicago",
    state: "IL",
    zip: "60601",
  };

  it("should render doctor information", () => {
    render(<DoctorCard doctor={mockDoctor} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/Cardiology/i)).toBeInTheDocument();
    expect(screen.getByText(/Chicago, IL/i)).toBeInTheDocument();
    expect(screen.getByText(/60601/i)).toBeInTheDocument();
  });

  it("should handle click on card", () => {
    const { handleDoctorClick } = require("../../utils/doctorUtils");
    render(<DoctorCard doctor={mockDoctor} />);

    const card = screen.getByText("John Doe").closest("div[class*='MuiCard']");
    card.click();

    expect(handleDoctorClick).toHaveBeenCalledWith(mockDoctor);
  });

  it("should render with minWidth prop", () => {
    const { container } = render(
      <DoctorCard doctor={mockDoctor} minWidth="300px" />
    );

    // The minWidth should be applied to the card
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should handle missing optional fields", () => {
    const incompleteDoctor = {
      npi: "1234567890",
      first_name: "John",
      last_name: "Doe",
      specialty: "Cardiology",
      city: "Chicago",
      state: "IL",
      zip: null,
    };

    render(<DoctorCard doctor={incompleteDoctor} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/Cardiology/i)).toBeInTheDocument();
  });
});
