import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import DepartmentManagement from "../pages/admin/DepartmentManagement.tsx";
import AddDepartment from "../pages/department/AddDepartment.tsx";
import EditDepartment from "../pages/department/EditDepartment.tsx";

jest.mock("../services/DepartmentApi.ts", () => ({
  getDepartments: jest.fn(),
  deleteDepartment: jest.fn(),
  createDepartment: jest.fn(),
  getDepartmentById: jest.fn(),
  updateDepartment: jest.fn(),
}));

import {
  getDepartments,
  deleteDepartment,
  createDepartment,
  getDepartmentById,
  updateDepartment,
} from "../services/DepartmentApi.ts";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Department Module Test Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.alert = jest.fn();

    window.confirm = jest.fn();
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
      (getDepartments as jest.Mock).mockResolvedValue({
        data: mockDepartments,
      });

      render(
        <MemoryRouter>
          <DepartmentManagement />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Loading departments matrix/i)
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(
          screen.getByText("Computer Science")
        ).toBeInTheDocument();

        expect(screen.getByText("Science")).toBeInTheDocument();

        expect(screen.getByText("Block A")).toBeInTheDocument();
      });
    });

    test("shows no departments found message", async () => {
      (getDepartments as jest.Mock).mockResolvedValue({
        data: [],
      });

      render(
        <MemoryRouter>
          <DepartmentManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/No Departments Found/i)
        ).toBeInTheDocument();
      });
    });

    test("deletes department successfully", async () => {
      (getDepartments as jest.Mock).mockResolvedValue({
        data: mockDepartments,
      });

      (deleteDepartment as jest.Mock).mockResolvedValue({});

      (window.confirm as jest.Mock).mockReturnValue(true);

      render(
        <MemoryRouter>
          <DepartmentManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Computer Science")
        ).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(deleteDepartment).toHaveBeenCalledWith(1);

        expect(window.alert).toHaveBeenCalledWith(
          "Department deleted successfully"
        );
      });
    });

    test("cancels delete when confirmation rejected", async () => {
      (getDepartments as jest.Mock).mockResolvedValue({
        data: mockDepartments,
      });

      (window.confirm as jest.Mock).mockReturnValue(false);

      render(
        <MemoryRouter>
          <DepartmentManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Computer Science")
        ).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      expect(deleteDepartment).not.toHaveBeenCalled();
    });
  });



  describe("AddDepartment Component", () => {
    test("creates department successfully", async () => {
      (createDepartment as jest.Mock).mockResolvedValue({});

      render(
        <MemoryRouter>
          <AddDepartment />
        </MemoryRouter>
      );

      fireEvent.change(
        screen.getByPlaceholderText("Department Name"),
        {
          target: {
            value: "Physics",
            name: "name",
          },
        }
      );

      fireEvent.change(screen.getByRole("combobox"), {
        target: {
          value: "Science",
          name: "type",
        },
      });

      fireEvent.change(
        screen.getByPlaceholderText("Office Location"),
        {
          target: {
            value: "Block B",
            name: "office_location",
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText("Year"),
        {
          target: {
            value: "2010",
            name: "established_year",
          },
        }
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /add department/i,
        })
      );

      await waitFor(() => {
        expect(createDepartment).toHaveBeenCalledWith({
          name: "Physics",
          type: "Science",
          office_location: "Block B",
          established_year: 2010,
        });

        expect(window.alert).toHaveBeenCalledWith(
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
      (getDepartmentById as jest.Mock).mockResolvedValue({
        data: mockDepartment,
      });

      (updateDepartment as jest.Mock).mockResolvedValue({});

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

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("Computer Science")
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByDisplayValue("Computer Science"),
        {
          target: {
            value: "Information Technology",
            name: "name",
          },
        }
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /update department/i,
        })
      );

      await waitFor(() => {
        expect(updateDepartment).toHaveBeenCalledWith(1, {
          id: 1,
          name: "Information Technology",
          type: "Science",
          office_location: "Block A",
          established_year: 2000,
        });

        expect(window.alert).toHaveBeenCalledWith(
          "Department updated successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/departments"
        );
      });
    });
  });
});