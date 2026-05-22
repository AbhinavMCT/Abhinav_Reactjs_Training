import { render, screen } from "@testing-library/react";
import UserHome from "../../pages/student/StudentHome.tsx";

describe("UserHome Component", () => {
  test("renders welcome message", () => {
    render(<UserHome />);

    expect(
      screen.getByText("Welcome to Student Home")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "This is the student home page."
      )
    ).toBeInTheDocument();
  });
});