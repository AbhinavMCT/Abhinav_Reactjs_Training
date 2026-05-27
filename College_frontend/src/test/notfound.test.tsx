import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import NotFound from "../pages/Notfound.tsx";
import * as JwtUtils from "../utils/Jwt.ts";

vi.mock("../utils/Jwt.ts", () => ({
  decodeToken: vi.fn(),
}));

describe("NotFound Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders 404 message", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();

    expect(
      screen.getByText("The page you are looking for does not exist."),
    ).toBeInTheDocument();
  });

  it("redirects Admin to admin home", () => {
    localStorage.setItem("access", "mockToken");

    vi.mocked(JwtUtils.decodeToken).mockReturnValue({
      id: 1,
      username: "admin",
      role: "Admin",
      exp: 123456789,
    });

    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", {
      name: /go back to home/i,
    });

    expect(link).toHaveAttribute("href", "/admin-home");
  });

  it("redirects staff to staff home", () => {
    localStorage.setItem("access", "mockToken");

    vi.mocked(JwtUtils.decodeToken).mockReturnValue({
      id: 1,
      username: "testuser",
      role: "staff",
      exp: 123456789,
    });

    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", {
      name: /go back to home/i,
    });

    expect(link).toHaveAttribute("href", "/staff-home");
  });

  it("redirects student to student home", () => {
    localStorage.setItem("access", "mockToken");

    vi.mocked(JwtUtils.decodeToken).mockReturnValue({
      id: 1,
      username: "student",
      role: "student",
      exp: 123456789,
    });

    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", {
      name: /go back to home/i,
    });

    expect(link).toHaveAttribute("href", "/student-home");
  });

  it("redirects to root path when no token exists", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", {
      name: /go back to home/i,
    });

    expect(link).toHaveAttribute("href", "/");
  });
});
