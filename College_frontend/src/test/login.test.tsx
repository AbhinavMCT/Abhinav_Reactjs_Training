import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Login from "../pages/Login.tsx";

import { loginUser } from "../services/LoginApi.ts";
import { decodeToken } from "../utils/Jwt.ts";

jest.mock("../services/LoginApi.ts", () => ({
  loginUser: jest.fn(),
}));

jest.mock("../utils/Jwt.ts", () => ({
  decodeToken: jest.fn(),
}));

const mockedLoginUser = loginUser as jest.Mock;
const mockedDecodeToken = decodeToken as jest.Mock;

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // =========================================================
  // Render Test
  // =========================================================

  test("renders login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter Username")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter Password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /submit/i })
    ).toBeInTheDocument();
  });

  // =========================================================
  // Input Change Test
  // =========================================================

  test("updates username and password fields", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText(
      "Enter Username"
    ) as HTMLInputElement;

    const passwordInput = screen.getByPlaceholderText(
      "Enter Password"
    ) as HTMLInputElement;

    fireEvent.change(usernameInput, {
      target: {
        name: "username",
        value: "abhinav",
      },
    });

    fireEvent.change(passwordInput, {
      target: {
        name: "password",
        value: "123456",
      },
    });

    expect(usernameInput.value).toBe("abhinav");
    expect(passwordInput.value).toBe("123456");
  });

  // =========================================================
  // Admin Login
  // =========================================================

  test("successful admin login", async () => {
    mockedLoginUser.mockResolvedValue({
      data: {
        token: "fake-admin-token",
      },
    });

    mockedDecodeToken.mockReturnValue({
      role: "Admin",
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
      target: {
        name: "username",
        value: "admin",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: {
        name: "password",
        value: "1234",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /submit/i })
    );

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        username: "admin",
        password: "1234",
      });

      expect(localStorage.getItem("access")).toBe(
        "fake-admin-token"
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        "/admin-home"
      );
    });
  });

  // =========================================================
  // Staff Login
  // =========================================================

  test("successful staff login", async () => {
    mockedLoginUser.mockResolvedValue({
      data: {
        token: "fake-staff-token",
      },
    });

    mockedDecodeToken.mockReturnValue({
      role: "staff",
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
      target: {
        name: "username",
        value: "staff",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: {
        name: "password",
        value: "1234",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /submit/i })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/staff-home"
      );
    });
  });

  // =========================================================
  // Student Login
  // =========================================================

  test("successful student login", async () => {
    mockedLoginUser.mockResolvedValue({
      data: {
        token: "fake-student-token",
      },
    });

    mockedDecodeToken.mockReturnValue({
      role: "student",
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
      target: {
        name: "username",
        value: "student",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: {
        name: "password",
        value: "1234",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /submit/i })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/student-home"
      );
    });
  });

  // =========================================================
  // Unknown Role Login
  // =========================================================

  test("redirects to home for unknown role", async () => {
    mockedLoginUser.mockResolvedValue({
      data: {
        token: "fake-token",
      },
    });

    mockedDecodeToken.mockReturnValue({
      role: "guest",
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
      target: {
        name: "username",
        value: "guest",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: {
        name: "password",
        value: "1234",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /submit/i })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  // =========================================================
  // API Error Test
  // =========================================================

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
        name: "username",
        value: "wronguser",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: {
        name: "password",
        value: "wrongpass",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /submit/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Invalid username or password")
      ).toBeInTheDocument();
    });
  });

  // =========================================================
  // Default Error Test
  // =========================================================

  test("shows default error message", async () => {
    mockedLoginUser.mockRejectedValue({});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
      target: {
        name: "username",
        value: "test",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: {
        name: "password",
        value: "test123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /submit/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "Something went wrong. Please try again."
        )
      ).toBeInTheDocument();
    });
  });

  // =========================================================
  // Prevent Multiple Submission
  // =========================================================

  test("prevents multiple submissions while loading", async () => {
    mockedLoginUser.mockResolvedValue({
      data: {
        token: "fake-token",
      },
    });

    mockedDecodeToken.mockReturnValue({
      role: "Admin",
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
      target: {
        name: "username",
        value: "admin",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: {
        name: "password",
        value: "1234",
      },
    });

    const submitButton = screen.getByRole("button", {
      name: /submit/i,
    });

    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledTimes(1);
    });
  });
});