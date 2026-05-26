import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

import AllocateSubjectStaff from "../pages/admin/Allocatesubjectstaff.tsx";
import EditSubjectStaff from "../pages/subjectstaff/Editsubjectstaff.tsx";
import AddSubjectStaff from "../pages/subjectstaff/Addsubjectstaff.tsx";

vi.mock("../services/SubjectStaffApi.ts", () => ({
  getAllSubjectStaff: vi.fn(),
  deleteSubjectStaff: vi.fn(),
  getSubjectStaffById: vi.fn(),
  updateSubjectStaff: vi.fn(),
  createSubjectStaff: vi.fn(),
}));

vi.mock("../services/SubjectApi.ts", () => ({
  getAllSubjects: vi.fn(),
}));

vi.mock("../services/StaffApi.ts", () => ({
  getAllStaff: vi.fn(),
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

describe("Subject Staff Allocation Management System", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    globalThis.alert = vi.fn();

    globalThis.confirm = vi.fn();

    localStorage.clear();
  });

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
      vi.mocked(getAllSubjectStaff).mockResolvedValue({
        data: mockAllocations,
      } as never);

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
      vi.mocked(getAllSubjectStaff).mockResolvedValue({
        data: [],
      } as never);

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
      vi.mocked(getAllSubjectStaff).mockResolvedValue({
        data: mockAllocations,
      } as never);

      vi.mocked(deleteSubjectStaff).mockResolvedValue(
        {} as never
      );

      vi.mocked(globalThis.confirm).mockReturnValue(true);

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

      expect(globalThis.confirm).toHaveBeenCalledWith(
        "Are you sure you want to delete this allocation assignment?"
      );

      await waitFor(() => {
        expect(deleteSubjectStaff).toHaveBeenCalledWith(1);

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Deleted successfully"
        );
      });
    });

    it("does not delete allocation when confirmation is cancelled", async () => {
      vi.mocked(getAllSubjectStaff).mockResolvedValue({
        data: mockAllocations,
      } as never);

      vi.mocked(globalThis.confirm).mockReturnValue(false);

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
      vi.mocked(getAllSubjects).mockResolvedValue({
        data: mockSubjects,
      } as never);

      vi.mocked(getAllStaff).mockResolvedValue({
        data: mockStaff,
      } as never);

      vi.mocked(createSubjectStaff).mockResolvedValue(
        {} as never
      );

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
      vi.mocked(getSubjectStaffById).mockResolvedValue({
        data: mockExistingAllocation,
      } as never);

      vi.mocked(getAllSubjects).mockResolvedValue({
        data: mockSubjects,
      } as never);

      vi.mocked(getAllStaff).mockResolvedValue({
        data: mockStaff,
      } as never);

      vi.mocked(updateSubjectStaff).mockResolvedValue(
        {} as never
      );

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

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Updated Successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/subject-staff"
        );
      });
    });
  });
});