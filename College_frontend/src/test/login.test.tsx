import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Login from "../pages/Login.tsx";
import * as LoginApi from "../services/LoginApi.ts";
import authReducer from "../store/authSlice.ts";
import "./setupMocks.tsx";

vi.mock("../services/LoginApi.ts", () => ({
  loginUser: vi.fn(),
}));

const fakeJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJyb2xlIjoiQWRtaW4ifQ." +
  "signature";

localStorage.setItem("accessToken", fakeJwt);

describe("Login Component", () => {
  let store: any;

  beforeEach(() => {
    vi.clearAllMocks();
    store = configureStore({ reducer: { auth: authReducer } });
  });

  it("handles successful login and redirects based on role", async () => {
    const mockResponse = {
      data: { accessToken: "fake-jwt", refreshToken: "fake-refresh" },
    };
    vi.mocked(LoginApi.loginUser).mockResolvedValue(mockResponse as any);

    const { decodeToken } = await import("../utils/Jwt.ts");
    vi.mocked(decodeToken).mockReturnValue({
      role: "Admin",
      username: "adminUser",
    } as any);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(screen.getByLabelText(/Username:/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "pass123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(LoginApi.loginUser).toHaveBeenCalled();
      expect(localStorage.getItem("accessToken")).toBe("fake-jwt");
    });
  });

  it("displays an error message on failed login", async () => {
    vi.mocked(LoginApi.loginUser).mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(screen.getByLabelText(/Username:/i), {
      target: { value: "wrong" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    const errorMsg = await screen.findByText(/Invalid credentials/i);
    expect(errorMsg).toBeDefined();
  });

  it("shows error when token decoding fails", async () => {
    vi.mocked(LoginApi.loginUser).mockResolvedValue({
      data: {
        accessToken: "token",
        refreshToken: "refresh",
      },
    } as any);

    const { decodeToken } = await import("../utils/Jwt.ts");
    vi.mocked(decodeToken).mockReturnValue(null);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "admin" },
    });

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button"));

    expect(
      await screen.findByText(/Invalid token received/i),
    ).toBeInTheDocument();
  });

});
