import { render, screen } from "@testing-library/react";
import App from "../../App.tsx";

describe("App Routing", () => {
  test("renders login page by default", () => {
    render(<App />);

    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});