import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";

import Login from "../pages/Login.tsx";

import { loginUser } from "../services/LoginApi.ts";
import { decodeToken } from "../utils/Jwt.ts";

vi.mock("../services/LoginApi.ts", () => ({
  loginUser: vi.fn(),
}));

vi.mock("../utils/Jwt.ts", () => ({
  decodeToken: vi.fn(),
}));

const mockedLoginUser = vi.mocked(loginUser);
const mockedDecodeToken = vi.mocked(decodeToken);

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("renders login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("successful admin login", async () => {
    mockedLoginUser.mockResolvedValue({
      data: {
        token: "fake-admin-token",
        message: "Login successful",
      },
    } as never);

    mockedDecodeToken.mockReturnValue({
      id: 1,
      username: "admin",
      role: "Admin",
      exp: 999999999,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
      target: {
        value: "admin",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: {
        value: "1234",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /submit/i,
      })
    );

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalled();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "access",
        "fake-admin-token"
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        "/admin-home"
      );
    });
  });

  test("shows API error message", async () => {
    mockedLoginUser.mockRejectedValue({
      response: {
        data: {
          message: "Invalid username or password",
        },
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
      target: {
        value: "wronguser",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: {
        value: "wrongpass",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /submit/i,
      })
    );

    expect(
      await screen.findByText(
        "Invalid username or password"
      )
    ).toBeInTheDocument();
  });
});