import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RegisterStaff from "../pages/RegisterUser.tsx";
import * as StaffApi from "../services/StaffApi.ts";
import * as StudentApi from "../services/StudentApi.ts";

vi.mock("../services/StaffApi.ts");
vi.mock("../services/StudentApi.ts");

vi.mock("../components/ProfileForm.tsx", () => ({
  default: ({
    handleSubmit,
    handleChange,
    handleAddressChange,
    handleLoginChange,
    errors,
  }: any) => (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        onChange={handleChange}
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        onChange={handleChange}
      />

      <label htmlFor="contact">Contact</label>
      <input
        id="contact"
        name="contact"
        onChange={handleChange}
      />

      <label htmlFor="gender">Gender</label>
      <select
        id="gender"
        name="gender"
        onChange={handleChange}
      >
        <option value="">Select</option>
        <option value="male">Male</option>
      </select>

      <label htmlFor="DOB">DOB</label>
      <input
        id="DOB"
        name="DOB"
        onChange={handleChange}
      />

      <label htmlFor="city">City</label>
      <input
        id="city"
        name="city"
        onChange={handleAddressChange}
      />

      <label htmlFor="district">District</label>
      <input
        id="district"
        name="district"
        onChange={handleAddressChange}
      />

      <label htmlFor="state">State</label>
      <input
        id="state"
        name="state"
        onChange={handleAddressChange}
      />

      <label htmlFor="pin">Pin</label>
      <input
        id="pin"
        name="pin"
        onChange={handleAddressChange}
      />

      <label htmlFor="username">Username</label>
      <input
        id="username"
        name="username"
        onChange={handleLoginChange}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        onChange={handleLoginChange}
      />

      <button type="submit">Submit</button>

      {errors?.name && (
        <span>{errors.name}</span>
      )}
    </form>
  ),
}));

vi.mock("../components/Breadcrumbs.tsx", () => ({
  default: () => <div>Breadcrumbs</div>,
}));

describe("RegisterStaff Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates required fields on submit", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/register-staff"]}>
          <RegisterStaff />
        </MemoryRouter>,
      );
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(await screen.findByText(/Name is required/i)).toBeDefined();
  });

  it("calls registerStaff API when path includes staff", async () => {
    vi.mocked(StaffApi.registerStaff).mockResolvedValue({
      data: { message: "Success" },
    } as any);

    render(
      <MemoryRouter initialEntries={["/staff-management/register"]}>
        <RegisterStaff />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe", name: "name" },
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@gmail.com", name: "email" },
    });

    fireEvent.change(screen.getByLabelText("Contact"), {
      target: { value: "9999999999", name: "contact" },
    });

    fireEvent.change(screen.getByLabelText("Gender"), {
      target: { value: "male", name: "gender" },
    });

    fireEvent.change(screen.getByLabelText("DOB"), {
      target: { value: "2000-01-01", name: "DOB" },
    });

    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: "Kochi", name: "city" },
    });

    fireEvent.change(screen.getByLabelText("District"), {
      target: { value: "Ernakulam", name: "district" },
    });

    fireEvent.change(screen.getByLabelText("State"), {
      target: { value: "Kerala", name: "state" },
    });

    fireEvent.change(screen.getByLabelText("Pin"), {
      target: { value: "682001", name: "pin" },
    });

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "john", name: "username" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password@123", name: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(StaffApi.registerStaff).toHaveBeenCalled();
    });
  });

  it("calls registerStudent API when path includes student", async () => {
    vi.mocked(StudentApi.registerStudent).mockResolvedValue({
      data: { message: "Success" },
    } as any);

    render(
      <MemoryRouter initialEntries={["/student-management/register"]}>
        <RegisterStaff />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: {
        value: "John Doe",
        name: "name",
      },
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        value: "john@gmail.com",
        name: "email",
      },
    });

    fireEvent.change(screen.getByLabelText("Contact"), {
      target: {
        value: "9999999999",
        name: "contact",
      },
    });

    fireEvent.change(screen.getByLabelText("Gender"), {
      target: {
        value: "male",
        name: "gender",
      },
    });

    fireEvent.change(screen.getByLabelText("DOB"), {
      target: {
        value: "2000-01-01",
        name: "DOB",
      },
    });

    fireEvent.change(screen.getByLabelText("City"), {
      target: {
        value: "Kochi",
        name: "city",
      },
    });

    fireEvent.change(screen.getByLabelText("District"), {
      target: {
        value: "Ernakulam",
        name: "district",
      },
    });

    fireEvent.change(screen.getByLabelText("State"), {
      target: {
        value: "Kerala",
        name: "state",
      },
    });

    fireEvent.change(screen.getByLabelText("Pin"), {
      target: {
        value: "682001",
        name: "pin",
      },
    });

    fireEvent.change(screen.getByLabelText("Username"), {
      target: {
        value: "john",
        name: "username",
      },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: "Password@123",
        name: "password",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /submit/i,
      }),
    );

    await waitFor(() => {
      expect(StudentApi.registerStudent).toHaveBeenCalled();
    });
  });
});
