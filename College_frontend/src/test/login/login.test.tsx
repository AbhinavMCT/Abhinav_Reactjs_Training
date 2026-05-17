/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../pages/login/login.tsx";
import { loginUser } from "../../api/loginApi.tsx";

const mockedNavigate = jest.fn();

jest.mock("../../api/loginApi", () => ({
  loginUser: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should render login form", () => {
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

  it("should update input fields", () => {
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
      target: { value: "abhinav" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "123456" },
    });

    expect(usernameInput.value).toBe("abhinav");
    expect(passwordInput.value).toBe("123456");
  });

  it("should login successfully", async () => {
    (loginUser as jest.Mock).mockResolvedValueOnce({
      data: {
        token: "fake-token",
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Username"),
      {
        target: { value: "abhinav" },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Password"),
      {
        target: { value: "123456" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /submit/i })
    );

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        username: "abhinav",
        password: "123456",
      });

      expect(localStorage.getItem("access")).toBe(
        "fake-token"
      );

      expect(mockedNavigate).toHaveBeenCalledWith(
        "/userhome"
      );
    });
  });

  it("should show api error message", async () => {
    (loginUser as jest.Mock).mockRejectedValueOnce({
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Username"),
      {
        target: { value: "wronguser" },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Password"),
      {
        target: { value: "wrongpass" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /submit/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Invalid credentials")
      ).toBeInTheDocument();
    });
  });

  it("should show default error message", async () => {
    (loginUser as jest.Mock).mockRejectedValueOnce({});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Username"),
      {
        target: { value: "wronguser" },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter Password"),
      {
        target: { value: "wrongpass" },
      }
    );

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
