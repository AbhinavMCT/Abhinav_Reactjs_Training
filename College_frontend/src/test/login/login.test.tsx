/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../pages/login/login.tsx";
import { loginUser } from "../../api/loginApi.tsx";

jest.mock("../../api/loginApi", () => ({
  loginUser: jest.fn(),
}));

const mockedLoginUser = loginUser as jest.Mock;

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
        value: "abhinav",
        name: "username",
      },
    });

    fireEvent.change(passwordInput, {
      target: {
        value: "123456",
        name: "password",
      },
    });

    expect(usernameInput.value).toBe("abhinav");
    expect(passwordInput.value).toBe("123456");
  });

  test("successful login", async () => {
    mockedLoginUser.mockResolvedValue({
      data: {
        token: "fake-token",
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
      target: {
        value: "admin",
        name: "username",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: {
        value: "1234",
        name: "password",
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
        "fake-token"
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        "/userhome"
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
        name: "username",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: {
        value: "wrongpass",
        name: "password",
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

  test("shows default error message", async () => {
    mockedLoginUser.mockRejectedValue({});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter Username"), {
      target: {
        value: "test",
        name: "username",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: {
        value: "test123",
        name: "password",
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
});