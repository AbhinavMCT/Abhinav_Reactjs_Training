import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import AllocateSubjectStaff from "../pages/admin/Allocatesubjectstaff.tsx";
import EditSubjectStaff from "../pages/subjectstaff/Editsubjectstaff.tsx";
import AddSubjectStaff from "../pages/subjectstaff/Addsubjectstaff.tsx";

jest.mock("../services/SubjectStaffApi.ts", () => ({
  getAllSubjectStaff: jest.fn(),
  deleteSubjectStaff: jest.fn(),
  getSubjectStaffById: jest.fn(),
  updateSubjectStaff: jest.fn(),
  createSubjectStaff: jest.fn(),
}));

jest.mock("../services/SubjectApi.ts", () => ({
  getAllSubjects: jest.fn(),
}));

jest.mock("../services/StaffApi.ts", () => ({
  getAllStaff: jest.fn(),
}));

import {
  getAllSubjectStaff,
  deleteSubjectStaff,
  getSubjectStaffById,
  updateSubjectStaff,
  createSubjectStaff,
} from "../services/SubjectStaffApi.ts";

import { getAllSubjects } from "../services/SubjectApi.ts";
import { getAllStaff } from "../services/StaffApi.ts";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Subject Staff Allocation Management System", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.alert = jest.fn();

    window.confirm = jest.fn();

    localStorage.clear();
  });

  // =========================================================
  // Allocate Subject Staff Component
  // =========================================================

  describe("AllocateSubjectStaff Component", () => {
    const mockAllocations = [
      {
        id: 1,
        staff_id: 101,
        staff_name: "John Doe",
        subject_id: 201,
        subject_name: "Mathematics",
      },
      {
        id: 2,
        staff_id: 102,
        staff_name: "Jane Smith",
        subject_id: 202,
        subject_name: "Science",
      },
    ];

    it("renders loading state and displays allocations", async () => {
      (getAllSubjectStaff as jest.Mock).mockResolvedValue({
        data: mockAllocations,
      });

      render(
        <MemoryRouter initialEntries={["/subject-staff"]}>
          <Routes>
            <Route
              path="/subject-staff"
              element={<AllocateSubjectStaff />}
            />
          </Routes>
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Loading Allocated Staff/i)
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();

        expect(
          screen.getByText("Mathematics")
        ).toBeInTheDocument();

        expect(screen.getByText("Jane Smith")).toBeInTheDocument();

        expect(screen.getByText("Science")).toBeInTheDocument();
      });
    });

    it("shows empty message when no allocations exist", async () => {
      (getAllSubjectStaff as jest.Mock).mockResolvedValue({
        data: [],
      });

      render(
        <MemoryRouter initialEntries={["/subject-staff"]}>
          <Routes>
            <Route
              path="/subject-staff"
              element={<AllocateSubjectStaff />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/No staff allocations found/i)
        ).toBeInTheDocument();
      });
    });

    it("deletes allocation successfully", async () => {
      (getAllSubjectStaff as jest.Mock).mockResolvedValue({
        data: mockAllocations,
      });

      (deleteSubjectStaff as jest.Mock).mockResolvedValue({});

      (window.confirm as jest.Mock).mockReturnValue(true);

      render(
        <MemoryRouter initialEntries={["/subject-staff"]}>
          <Routes>
            <Route
              path="/subject-staff"
              element={<AllocateSubjectStaff />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButtons[0]);

      expect(window.confirm).toHaveBeenCalledWith(
        "Are you sure you want to delete this allocation assignment?"
      );

      await waitFor(() => {
        expect(deleteSubjectStaff).toHaveBeenCalledWith(1);

        expect(window.alert).toHaveBeenCalledWith(
          "Deleted successfully"
        );
      });
    });

    it("does not delete allocation when confirmation is cancelled", async () => {
      (getAllSubjectStaff as jest.Mock).mockResolvedValue({
        data: mockAllocations,
      });

      (window.confirm as jest.Mock).mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={["/subject-staff"]}>
          <Routes>
            <Route
              path="/subject-staff"
              element={<AllocateSubjectStaff />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButtons[0]);

      expect(deleteSubjectStaff).not.toHaveBeenCalled();

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  // =========================================================
  // Add Subject Staff Component
  // =========================================================

  describe("AddSubjectStaff Component", () => {
    const mockSubjects = [
      { id: 1, name: "Physics" },
      { id: 2, name: "Chemistry" },
    ];

    const mockStaff = [
      { id: 10, name: "Dr. Alistair" },
      { id: 11, name: "Prof. Snape" },
    ];

    it("loads dropdown values and submits form successfully", async () => {
      (getAllSubjects as jest.Mock).mockResolvedValue({
        data: mockSubjects,
      });

      (getAllStaff as jest.Mock).mockResolvedValue({
        data: mockStaff,
      });

      (createSubjectStaff as jest.Mock).mockResolvedValue({});

      render(
        <MemoryRouter initialEntries={["/subjectstaff/add"]}>
          <Routes>
            <Route
              path="/subjectstaff/add"
              element={<AddSubjectStaff />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("option", {
            name: "Physics",
          })
        ).toBeInTheDocument();
      });

      const subjectSelect = document.querySelector(
        'select[name="subject_id"]'
      ) as HTMLSelectElement;

      const staffSelect = document.querySelector(
        'select[name="staff_id"]'
      ) as HTMLSelectElement;

      fireEvent.change(subjectSelect, {
        target: {
          value: "1",
        },
      });

      fireEvent.change(staffSelect, {
        target: {
          value: "11",
        },
      });

      fireEvent.submit(
        screen.getByRole("button", {
          name: /Add Subject Staff/i,
        })
      );

      await waitFor(() => {
        expect(createSubjectStaff).toHaveBeenCalledWith({
          subject_id: 1,
          staff_id: 11,
        });

        expect(mockNavigate).toHaveBeenCalledWith(
          "/subject-staff"
        );
      });
    });
  });

  // =========================================================
  // Edit Subject Staff Component
  // =========================================================

  describe("EditSubjectStaff Component", () => {
    const mockExistingAllocation = [
      {
        id: 5,
        subject_id: 2,
        staff_id: 10,
      },
    ];

    const mockSubjects = [
      { id: 1, name: "Physics" },
      { id: 2, name: "Chemistry" },
    ];

    const mockStaff = [
      { id: 10, name: "Dr. Alistair" },
      { id: 11, name: "Prof. Snape" },
    ];

    it("pre-populates form and updates allocation successfully", async () => {
      (getSubjectStaffById as jest.Mock).mockResolvedValue({
        data: mockExistingAllocation,
      });

      (getAllSubjects as jest.Mock).mockResolvedValue({
        data: mockSubjects,
      });

      (getAllStaff as jest.Mock).mockResolvedValue({
        data: mockStaff,
      });

      (updateSubjectStaff as jest.Mock).mockResolvedValue({});

      render(
        <MemoryRouter initialEntries={["/subjectstaff/edit/5"]}>
          <Routes>
            <Route
              path="/subjectstaff/edit/:id"
              element={<EditSubjectStaff />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(getSubjectStaffById).toHaveBeenCalledWith(5);
      });

      const subjectSelect = document.querySelector(
        'select[name="subject_id"]'
      ) as HTMLSelectElement;

      const staffSelect = document.querySelector(
        'select[name="staff_id"]'
      ) as HTMLSelectElement;

      await waitFor(() => {
        expect(subjectSelect.value).toBe("2");

        expect(staffSelect.value).toBe("10");
      });

      fireEvent.change(subjectSelect, {
        target: {
          value: "1",
        },
      });

      fireEvent.submit(
        screen.getByRole("button", {
          name: /Update Subject Staff/i,
        })
      );

      await waitFor(() => {
        expect(updateSubjectStaff).toHaveBeenCalledWith(5, {
          id: 5,
          subject_id: 1,
          staff_id: 10,
        });

        expect(window.alert).toHaveBeenCalledWith(
          "Updated Successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/subject-staff"
        );
      });
    });
  });
});