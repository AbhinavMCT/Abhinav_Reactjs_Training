import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "./setupMocks.tsx";
import { MemoryRouter } from "react-router-dom";
import DepartmentManagement from "../pages/admin/DepartmentManagement.tsx";
import DepartmentPage from "../pages/department/DepartmentPage.tsx";
import * as DepartmentApi from "../services/DepartmentApi.ts";

vi.mock("../services/DepartmentApi");

vi.mock("../interceptor", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Department Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DepartmentManagement", () => {
    it("fetches and displays departments", async () => {
      vi.mocked(DepartmentApi.getDepartments).mockResolvedValue({
        department: [
          {
            id: 1,
            name: "Computer Science",
            type: "Academic",
            office_location: "Block A",
            established_year: 2000,
          },
        ],
        totalPages: 1,
        totalRecords: 1,
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <DepartmentManagement />
          </MemoryRouter>,
        );
      });

      expect(await screen.findByText("Computer Science")).toBeDefined();
    });

    it("deletes a department", async () => {
      vi.mocked(DepartmentApi.getDepartments).mockResolvedValue({
        department: [{ id: 1, name: "CS" }],
        totalPages: 1,
        totalRecords: 1,
      } as any);
      vi.mocked(DepartmentApi.deleteDepartment).mockResolvedValue({} as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <DepartmentManagement />
          </MemoryRouter>,
        );
      });

      const deleteBtn = await screen.findByText("Delete");
      fireEvent.click(deleteBtn);

      const confirmBtn = screen.getByText("Confirm");
      await act(async () => {
        fireEvent.click(confirmBtn);
      });

      expect(DepartmentApi.deleteDepartment).toHaveBeenCalledWith(1);
    });
  });

  describe("DepartmentPage (Form)", () => {
    it("validates required fields", async () => {
      await act(async () => {
        render(
          <MemoryRouter>
            <DepartmentPage isEditMode={false} />
          </MemoryRouter>,
        );
      });

      fireEvent.click(screen.getByRole("button", { name: /add department/i }));
      expect(screen.getByText(/Department name is required/i)).toBeDefined();
    });

    it("submits form with correct data", async () => {
      vi.mocked(DepartmentApi.createDepartment).mockResolvedValue({} as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <DepartmentPage isEditMode={false} />
          </MemoryRouter>,
        );
      });

      fireEvent.change(screen.getByLabelText(/Department Name/i), {
        target: { value: "Physics" },
      });

      fireEvent.change(screen.getByLabelText(/Department Type/i), {
        target: { value: "Academic" },
      });

      fireEvent.change(screen.getByLabelText(/Office Location/i), {
        target: { value: "Block B" },
      });

      fireEvent.change(screen.getByLabelText(/Established Year/i), {
        target: { value: "2010" },
      });

      fireEvent.submit(
        screen
          .getByRole("button", {
            name: /add department/i,
          })
          .closest("form")!,
      );

      await waitFor(() => {
        expect(DepartmentApi.createDepartment).toHaveBeenCalled();
      });
    });


    it("handles create failure", async () => {
      vi.mocked(DepartmentApi.createDepartment).mockRejectedValue(
        new Error("Failed"),
      );

      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <MemoryRouter>
          <DepartmentPage navigate={vi.fn()} isEditMode={false} />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/Department Name/i), {
        target: { value: "Physics" },
      });

      fireEvent.change(screen.getByLabelText(/Department Type/i), {
        target: { value: "Academic" },
      });

      fireEvent.change(screen.getByLabelText(/Office Location/i), {
        target: { value: "Block A" },
      });

      fireEvent.change(screen.getByLabelText(/Established Year/i), {
        target: { value: "2020" },
      });

      fireEvent.submit(
        screen
          .getByRole("button", {
            name: /add department/i,
          })
          .closest("form")!,
      );

      await waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });

      spy.mockRestore();
    });

    it("handles create failure", async () => {
      vi.mocked(DepartmentApi.createDepartment).mockRejectedValue(
        new Error("Failed"),
      );

      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <MemoryRouter>
          <DepartmentPage navigate={vi.fn()} isEditMode={false} />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/Department Name/i), {
        target: { value: "Physics" },
      });

      fireEvent.change(screen.getByLabelText(/Department Type/i), {
        target: { value: "Academic" },
      });

      fireEvent.change(screen.getByLabelText(/Office Location/i), {
        target: { value: "Block A" },
      });

      fireEvent.change(screen.getByLabelText(/Established Year/i), {
        target: { value: "2020" },
      });

      fireEvent.submit(
        screen
          .getByRole("button", {
            name: /add department/i,
          })
          .closest("form")!,
      );

      await waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });

      spy.mockRestore();
    });

    it("validates invalid department values", async () => {
      render(
        <MemoryRouter>
          <DepartmentPage navigate={vi.fn()} isEditMode={false} />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/Department Name/i), {
        target: { value: "CS" }, // less than 3 chars
      });

      fireEvent.change(screen.getByLabelText(/Department Type/i), {
        target: { value: "" },
      });

      fireEvent.change(screen.getByLabelText(/Office Location/i), {
        target: { value: "" },
      });

      fireEvent.change(screen.getByLabelText(/Established Year/i), {
        target: { value: "1800" },
      });

      fireEvent.submit(
        screen
          .getByRole("button", {
            name: /add department/i,
          })
          .closest("form")!,
      );

      expect(
        await screen.findByText(/at least 3 characters/i),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Department type is required/i),
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Office location is required/i),
      ).toBeInTheDocument();

      expect(screen.getByText(/Year must be between/i)).toBeInTheDocument();
    });
  });
});
