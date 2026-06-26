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
import StudentManagement from "../pages/admin/StudentManagement.tsx";
import ViewStudent from "../pages/student/ViewStudentProfile.tsx";
import * as StudentApi from "../services/StudentApi.ts";

vi.mock("../services/StudentApi");

vi.mock("../pages/admin/EditStudentPage.tsx");

vi.mock("../components/ImportStudentModal.tsx", () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div>
        Import Modal<button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe("Student Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("StudentManagement", () => {
    it("fetches and displays student list", async () => {
      vi.mocked(StudentApi.getAllStudents).mockResolvedValue({
        data: {
          students: [{ id: 1, name: "Alice Smith" }],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <StudentManagement />
          </MemoryRouter>,
        );
      });

      expect(await screen.findByText("Alice Smith")).toBeDefined();
    });

    it("opens import modal", async () => {
      await act(async () => {
        render(
          <MemoryRouter>
            <StudentManagement />
          </MemoryRouter>,
        );
      });
      fireEvent.click(screen.getByText(/\+ Import Students Details/i));
      expect(screen.getByText("Import Modal")).toBeDefined();
    });
  });

  describe("ViewStudent", () => {
    it("displays profile details", async () => {
      vi.mocked(StudentApi.getProfile).mockResolvedValue({
        data: { name: "Bob", email: "bob@test.com", address: { city: "Pune" } },
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <ViewStudent />
          </MemoryRouter>,
        );
      });

      expect(await screen.findByText("Bob")).toBeDefined();
    });
  });

  it("deletes a student successfully", async () => {
    vi.mocked(StudentApi.getAllStudents).mockResolvedValue({
      data: {
        students: [{ id: 1, name: "Alice Smith" }],
        totalPages: 1,
        totalRecords: 1,
      },
    } as any);

    vi.mocked(StudentApi.deleteStudent).mockResolvedValue({} as any);

    render(
      <MemoryRouter>
        <StudentManagement />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByText("Delete"));

    fireEvent.click(screen.getByText("Confirm"));
  });

  it("handles delete api failure", async () => {
    vi.mocked(StudentApi.getAllStudents).mockResolvedValue({
      data: {
        students: [{ id: 1, name: "Alice" }],
        totalPages: 1,
        totalRecords: 1,
      },
    } as any);

    vi.mocked(StudentApi.deleteStudent).mockRejectedValue(
      new Error("Delete Failed"),
    );

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <StudentManagement />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByText("Delete"));

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it("closes confirm modal on cancel", async () => {
    vi.mocked(StudentApi.getAllStudents).mockResolvedValue({
      data: {
        students: [{ id: 1, name: "Alice" }],
        totalPages: 1,
        totalRecords: 1,
      },
    } as any);

    render(
      <MemoryRouter>
        <StudentManagement />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByText("Delete"));

    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
  });

  it("handles load student failure", async () => {
    vi.mocked(StudentApi.getAllStudents).mockRejectedValue(
      new Error("API Error"),
    );

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <StudentManagement />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it("renders empty table", async () => {
    vi.mocked(StudentApi.getAllStudents).mockResolvedValue({
      data: {
        students: [],
        totalPages: 1,
        totalRecords: 0,
      },
    } as any);

    render(
      <MemoryRouter>
        <StudentManagement />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Pagination")).toBeInTheDocument();
  });
});
