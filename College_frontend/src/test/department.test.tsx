import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";

import DepartmentManagement from "../pages/admin/DepartmentManagement.tsx";
import AddDepartment from "../pages/department/DepartmentPage.tsx";
import EditDepartment from "../pages/department/EditDepartment.tsx";

vi.mock("../services/DepartmentApi.ts", () => ({
  getDepartments: vi.fn(),
  deleteDepartment: vi.fn(),
  createDepartment: vi.fn(),
  getDepartmentById: vi.fn(),
  updateDepartment: vi.fn(),
}));

import {
  getDepartments,
  deleteDepartment,
  createDepartment,
  getDepartmentById,
  updateDepartment,
} from "../services/DepartmentApi.ts";

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

describe("Department Module Test Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.alert = vi.fn();
    globalThis.confirm = vi.fn();
  });

  describe("DepartmentManagement Component", () => {
    const mockDepartments = [
      {
        id: 1,
        name: "Computer Science",
        type: "Science",
        office_location: "Block A",
        established_year: 2000,
      },
    ];

    test("renders department data", async () => {
      vi.mocked(getDepartments).mockResolvedValue({
        data: mockDepartments,
      } as never);

      render(
        <MemoryRouter>
          <DepartmentManagement />
        </MemoryRouter>
      );

      expect(
        await screen.findByText("Computer Science")
      ).toBeInTheDocument();

      expect(screen.getByText("Science")).toBeInTheDocument();

      expect(screen.getByText("Block A")).toBeInTheDocument();
    });

    test("shows no departments found message", async () => {
      vi.mocked(getDepartments).mockResolvedValue({
        data: [],
      } as never);

      render(
        <MemoryRouter>
          <DepartmentManagement />
        </MemoryRouter>
      );

      expect(
        await screen.findByText(/No Departments Found/i)
      ).toBeInTheDocument();
    });

    test("deletes department successfully", async () => {
      vi.mocked(getDepartments).mockResolvedValue({
        data: mockDepartments,
      } as never);

      vi.mocked(deleteDepartment).mockResolvedValue(
        {} as never
      );

      vi.mocked(globalThis.confirm).mockReturnValue(true);

      render(
        <MemoryRouter>
          <DepartmentManagement />
        </MemoryRouter>
      );

      expect(
        await screen.findByText("Computer Science")
      ).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", {
          name: /delete/i,
        })
      );

      await waitFor(() => {
        expect(deleteDepartment).toHaveBeenCalledWith(1);

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Department deleted successfully"
        );
      });
    });

    test("cancels delete when confirmation rejected", async () => {
      vi.mocked(getDepartments).mockResolvedValue({
        data: mockDepartments,
      } as never);

      vi.mocked(globalThis.confirm).mockReturnValue(false);

      render(
        <MemoryRouter>
          <DepartmentManagement />
        </MemoryRouter>
      );

      expect(
        await screen.findByText("Computer Science")
      ).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", {
          name: /delete/i,
        })
      );

      expect(deleteDepartment).not.toHaveBeenCalled();
    });
  });

  describe("AddDepartment Component", () => {
    test("creates department successfully", async () => {
      vi.mocked(createDepartment).mockResolvedValue(
        {} as never
      );

      render(
        <MemoryRouter>
          <AddDepartment />
        </MemoryRouter>
      );

      fireEvent.change(
        screen.getByPlaceholderText("Department Name"),
        {
          target: { value: "Physics" },
        }
      );

      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "Science" },
      });

      fireEvent.change(
        screen.getByPlaceholderText("Office Location"),
        {
          target: { value: "Block B" },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText("Year"),
        {
          target: { value: "2010" },
        }
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /add department/i,
        })
      );

      await waitFor(() => {
        expect(createDepartment).toHaveBeenCalled();

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Department added successfully"
        );
      });
    });
  });

  describe("EditDepartment Component", () => {
    const mockDepartment = [
      {
        id: 1,
        name: "Computer Science",
        type: "Science",
        office_location: "Block A",
        established_year: 2000,
      },
    ];

    test("loads department and updates successfully", async () => {
      vi.mocked(getDepartmentById).mockResolvedValue({
        data: mockDepartment,
      } as never);

      vi.mocked(updateDepartment).mockResolvedValue(
        {} as never
      );

      render(
        <MemoryRouter initialEntries={["/departments/edit/1"]}>
          <Routes>
            <Route
              path="/departments/edit/:id"
              element={<EditDepartment />}
            />
          </Routes>
        </MemoryRouter>
      );

      expect(
        await screen.findByDisplayValue("Computer Science")
      ).toBeInTheDocument();

      fireEvent.change(
        screen.getByDisplayValue("Computer Science"),
        {
          target: {
            value: "Information Technology",
          },
        }
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /update department/i,
        })
      );

      await waitFor(() => {
        expect(updateDepartment).toHaveBeenCalled();

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Department updated successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/departments"
        );
      });
    });
  });
});