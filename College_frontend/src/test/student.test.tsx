import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import StudentManagement from "../pages/admin/StudentManagement.tsx";
import RegisterStudent from "../pages/student/RegisterStudent.tsx";
import EditStudent from "../pages/admin/EditStudent.tsx";
import EditProfile from "../pages/student/EditStudentPage.tsx";
import ViewStudent from "../pages/student/ViewStudentProfile.tsx";

vi.mock("../services/StudentApi.ts", () => ({
  getAllStudents: vi.fn(),
  deleteStudent: vi.fn(),
  registerStudent: vi.fn(),
  getStudentById: vi.fn(),
  updateStudents: vi.fn(),
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
}));

import {
  getAllStudents,
  deleteStudent,
  registerStudent,
  getStudentById,
  updateStudents,
  getProfile,
  updateProfile,
} from "../services/StudentApi.ts";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<
    typeof import("react-router-dom")
  >("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Student Module Test Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    globalThis.alert = vi.fn();

    globalThis.confirm = vi.fn();
  });

  describe("StudentManagement Component", () => {
    const mockStudents = [
      {
        userData: {
          id: 1,
          name: "Abhinav",
          email: "abhinav@gmail.com",
          contact: "9999999999",
          gender: "male",
          DOB: "2000-01-01",
        },

        addressData: {
          city: "Kochi",
          district: "Ernakulam",
          state: "Kerala",
          pin: 682001,
        },
      },
    ];

    test("renders student data", async () => {
      vi.mocked(getAllStudents).mockResolvedValue({
        data: mockStudents,
      } as never);

      render(
        <MemoryRouter>
          <StudentManagement />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Loading students/i)
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Abhinav")).toBeInTheDocument();

        expect(
          screen.getByText("abhinav@gmail.com")
        ).toBeInTheDocument();

        expect(screen.getByText("Kochi")).toBeInTheDocument();
      });
    });

    test("deletes student successfully", async () => {
      vi.mocked(getAllStudents).mockResolvedValue({
        data: mockStudents,
      } as never);

      vi.mocked(deleteStudent).mockResolvedValue(
        {} as never
      );

      vi.mocked(globalThis.confirm).mockReturnValue(true);

      render(
        <MemoryRouter>
          <StudentManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Abhinav")).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(deleteStudent).toHaveBeenCalledWith(1);
      });
    });

    test("cancels delete when confirmation rejected", async () => {
      vi.mocked(getAllStudents).mockResolvedValue({
        data: mockStudents,
      } as never);

      vi.mocked(globalThis.confirm).mockReturnValue(false);

      render(
        <MemoryRouter>
          <StudentManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("Abhinav")).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      expect(deleteStudent).not.toHaveBeenCalled();
    });
  });

  describe("RegisterStudent Component", () => {
    test("registers student successfully", async () => {
      vi.mocked(registerStudent).mockResolvedValue({
        data: {
          message: "Student Registered Successfully",
        },
      } as never);

      render(
        <MemoryRouter>
          <RegisterStudent />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText("Name"), {
        target: {
          value: "Abhinav",
          name: "name",
        },
      });

      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: {
          value: "abhinav@gmail.com",
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

      const dobInput = document.querySelector(
        'input[name="DOB"]'
      ) as HTMLInputElement;

      fireEvent.change(dobInput, {
        target: {
          value: "2000-01-01",
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
          value: "abhinav",
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
        expect(registerStudent).toHaveBeenCalled();

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Student Registered Successfully"
        );
      });
    });
  });

  describe("ViewStudent Component", () => {
    const mockProfile = {
      name: "Abhinav",
      email: "abhinav@gmail.com",
      contact: "9999999999",
      gender: "male",
      DOB: "2000-01-01",

      address: {
        city: "Kochi",
        district: "Ernakulam",
        state: "Kerala",
        pin: 682001,
      },
    };

    test("renders profile data", async () => {
      vi.mocked(getProfile).mockResolvedValue({
        data: mockProfile,
      } as never);

      render(
        <MemoryRouter>
          <ViewStudent />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Loading Profile/i)
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Abhinav")).toBeInTheDocument();

        expect(
          screen.getByText("abhinav@gmail.com")
        ).toBeInTheDocument();

        expect(screen.getByText("Kochi")).toBeInTheDocument();
      });
    });
  });

  describe("EditProfile Component", () => {
    const mockProfile = {
      name: "Abhinav",
      email: "abhinav@gmail.com",
      contact: "9999999999",
      gender: "male",
      DOB: "2000-01-01",
      address_id: 1,

      address: {
        city: "Kochi",
        district: "Ernakulam",
        state: "Kerala",
        pin: 682001,
      },

      login: {
        username: "abhinav",
        password: "123456",
      },
    };

    test("loads profile and updates successfully", async () => {
      vi.mocked(getProfile).mockResolvedValue({
        data: mockProfile,
      } as never);

      vi.mocked(updateProfile).mockResolvedValue({
        data: {
          message: "Profile Updated Successfully",
        },
      } as never);

      render(
        <MemoryRouter>
          <EditProfile />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue("Abhinav")).toBeInTheDocument();
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

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Profile Updated Successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/student/profile"
        );
      });
    });
  });

  describe("EditStudent Component", () => {
    const mockStudent = {
      name: "Abhinav",
      email: "abhinav@gmail.com",
      contact: "9999999999",
      gender: "male",
      DOB: "2000-01-01",
      address_id: 1,

      address: {
        city: "Kochi",
        district: "Ernakulam",
        state: "Kerala",
        pin: 682001,
      },

      login: {
        username: "abhinav",
        password: "123456",
      },
    };

    test("loads student and updates successfully", async () => {
      vi.mocked(getStudentById).mockResolvedValue({
        data: mockStudent,
      } as never);

      vi.mocked(updateStudents).mockResolvedValue({
        data: {
          message: "Student Updated Successfully",
        },
      } as never);

      render(
        <MemoryRouter initialEntries={["/student/edit/1"]}>
          <Routes>
            <Route
              path="/student/edit/:id"
              element={<EditStudent />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue("Abhinav")).toBeInTheDocument();
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
        expect(updateStudents).toHaveBeenCalled();

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Student Updated Successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/student-management"
        );
      });
    });
  });
});