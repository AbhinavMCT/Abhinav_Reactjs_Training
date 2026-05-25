import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import StaffManagement from "../pages/admin/StaffManagement.tsx";
import RegisterStaff from "../pages/staff/RegisterStaff.tsx";
import EditStaff from "../pages/admin/EditStaff.tsx";
import EditProfile from "../pages/staff/EditStaffProfile.tsx";
import ViewStaff from "../pages/staff/ViewStaffProfile.tsx";

jest.mock("../services/StaffApi.ts", () => ({
  getAllStaff: jest.fn(),
  deleteStaff: jest.fn(),
  registerStaff: jest.fn(),
  getStaffById: jest.fn(),
  updateStaff: jest.fn(),
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
}));

import {
  getAllStaff,
  deleteStaff,
  registerStaff,
  getStaffById,
  updateStaff,
  getProfile,
  updateProfile,
} from "../services/StaffApi.ts";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Staff Module Test Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.alert = jest.fn();

    window.confirm = jest.fn();
  });



  describe("StaffManagement Component", () => {
    const mockStaff = [
      {
        userData: {
          id: 1,
          name: "John",
          email: "john@gmail.com",
          contact: "9999999999",
          gender: "male",
          DOB: "1999-01-01",
        },

        addressData: {
          city: "Kochi",
          district: "Ernakulam",
          state: "Kerala",
          pin: 682001,
        },
      },
    ];

    test("renders staff data", async () => {
      (getAllStaff as jest.Mock).mockResolvedValue({
        data: mockStaff,
      });

      render(
        <MemoryRouter>
          <StaffManagement />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Loading staff/i)
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();

        expect(
          screen.getByText("john@gmail.com")
        ).toBeInTheDocument();

        expect(screen.getByText("Kochi")).toBeInTheDocument();
      });
    });

    test("deletes staff successfully", async () => {
      (getAllStaff as jest.Mock).mockResolvedValue({
        data: mockStaff,
      });

      (deleteStaff as jest.Mock).mockResolvedValue({});

      (window.confirm as jest.Mock).mockReturnValue(true);

      render(
        <MemoryRouter>
          <StaffManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(deleteStaff).toHaveBeenCalledWith(1);
      });
    });

    test("cancels delete when confirmation rejected", async () => {
      (getAllStaff as jest.Mock).mockResolvedValue({
        data: mockStaff,
      });

      (window.confirm as jest.Mock).mockReturnValue(false);

      render(
        <MemoryRouter>
          <StaffManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      expect(deleteStaff).not.toHaveBeenCalled();
    });
  });



  describe("RegisterStaff Component", () => {
    test("registers staff successfully", async () => {
      (registerStaff as jest.Mock).mockResolvedValue({
        data: {
          message: "Staff Registered Successfully",
        },
      });

      render(
        <MemoryRouter>
          <RegisterStaff />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText("Name"), {
        target: {
          value: "John",
          name: "name",
        },
      });

      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: {
          value: "john@gmail.com",
          name: "email",
        },
      });

      fireEvent.change(screen.getByPlaceholderText("Contact"), {
        target: {
          value: "9999999999",
          name: "contact",
        },
      });

      fireEvent.change(screen.getByRole("combobox"), {
        target: {
          value: "male",
          name: "gender",
        },
      });

      const dateInput = document.querySelector(
        'input[name="DOB"]'
      ) as HTMLInputElement;

      fireEvent.change(dateInput, {
        target: {
          value: "1999-01-01",
          name: "DOB",
        },
      });

      fireEvent.change(screen.getByPlaceholderText("City"), {
        target: {
          value: "Kochi",
          name: "city",
        },
      });

      fireEvent.change(screen.getByPlaceholderText("District"), {
        target: {
          value: "Ernakulam",
          name: "district",
        },
      });

      fireEvent.change(screen.getByPlaceholderText("State"), {
        target: {
          value: "Kerala",
          name: "state",
        },
      });

      fireEvent.change(screen.getByPlaceholderText("Pin"), {
        target: {
          value: "682001",
          name: "pin",
        },
      });

      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: {
          value: "john",
          name: "username",
        },
      });

      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: {
          value: "123456",
          name: "password",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /register student/i,
        })
      );

      await waitFor(() => {
        expect(registerStaff).toHaveBeenCalled();

        expect(window.alert).toHaveBeenCalledWith(
          "Staff Registered Successfully"
        );
      });
    });
  });



  describe("ViewStaff Component", () => {
    const mockProfile = {
      name: "John",
      email: "john@gmail.com",
      contact: "9999999999",
      gender: "male",
      DOB: "1999-01-01",

      address: {
        city: "Kochi",
        district: "Ernakulam",
        state: "Kerala",
        pin: 682001,
      },
    };

    test("renders profile data", async () => {
      (getProfile as jest.Mock).mockResolvedValue({
        data: mockProfile,
      });

      render(
        <MemoryRouter>
          <ViewStaff />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Loading Profile/i)
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();

        expect(
          screen.getByText("john@gmail.com")
        ).toBeInTheDocument();

        expect(screen.getByText("Kochi")).toBeInTheDocument();
      });
    });
  });



  describe("EditProfile Component", () => {
    const mockProfile = {
      name: "John",
      email: "john@gmail.com",
      contact: "9999999999",
      gender: "male",
      DOB: "1999-01-01",
      address_id: 1,

      address: {
        city: "Kochi",
        district: "Ernakulam",
        state: "Kerala",
        pin: 682001,
      },

      login: {
        username: "john",
        password: "123456",
      },
    };

    test("loads profile and updates successfully", async () => {
      (getProfile as jest.Mock).mockResolvedValue({
        data: mockProfile,
      });

      (updateProfile as jest.Mock).mockResolvedValue({
        data: {
          message: "Profile Updated Successfully",
        },
      });

      render(
        <MemoryRouter>
          <EditProfile />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue("John")).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText("City"), {
        target: {
          value: "Thrissur",
          name: "city",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /update profile/i,
        })
      );

      await waitFor(() => {
        expect(updateProfile).toHaveBeenCalled();

        expect(window.alert).toHaveBeenCalledWith(
          "Profile Updated Successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/staff/profile"
        );
      });
    });
  });



  describe("EditStaff Component", () => {
    const mockStaff = {
      name: "John",
      email: "john@gmail.com",
      contact: "9999999999",
      gender: "male",
      DOB: "1999-01-01",
      address_id: 1,

      address: {
        city: "Kochi",
        district: "Ernakulam",
        state: "Kerala",
        pin: 682001,
      },

      login: {
        username: "john",
        password: "123456",
      },
    };

    test("loads staff and updates successfully", async () => {
      (getStaffById as jest.Mock).mockResolvedValue({
        data: mockStaff,
      });

      (updateStaff as jest.Mock).mockResolvedValue({
        data: {
          message: "Staff Updated Successfully",
        },
      });

      render(
        <MemoryRouter initialEntries={["/staff/edit/1"]}>
          <Routes>
            <Route
              path="/staff/edit/:id"
              element={<EditStaff />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue("John")).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText("City"), {
        target: {
          value: "Thrissur",
          name: "city",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /update student/i,
        })
      );

      await waitFor(() => {
        expect(updateStaff).toHaveBeenCalled();

        expect(window.alert).toHaveBeenCalledWith(
          "Staff Updated Successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/staff-management"
        );
      });
    });
  });
});