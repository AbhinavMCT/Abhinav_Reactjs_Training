import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import SubjectManagement from "../pages/admin/SubjectManagement.tsx";
import AddSubject from "../pages/subjects/Subjectpage.tsx";
import EditSubject from "../pages/subjects/EditSubject.tsx";

vi.mock("../services/SubjectApi.ts", () => ({
  getAllSubjects: vi.fn(),
  deleteSubject: vi.fn(),
  createSubject: vi.fn(),
  getSubjectById: vi.fn(),
  updateSubject: vi.fn(),
}));

vi.mock("../services/CourseApi.ts", () => ({
  getAllCourses: vi.fn(),
}));

import {
  getAllSubjects,
  deleteSubject,
  createSubject,
  getSubjectById,
  updateSubject,
} from "../services/SubjectApi.ts";

import { getAllCourses } from "../services/CourseApi.ts";

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

describe("Subject Module Test Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    globalThis.alert = vi.fn();

    globalThis.confirm = vi.fn();
  });

  describe("SubjectManagement Component", () => {
    const mockSubjects = [
      {
        id: 1,
        name: "Mathematics",
        type: "Core",
        course_id: 10,
        course_name: "BCA",
      },
    ];

    test("renders subject data", async () => {
      vi.mocked(getAllSubjects).mockResolvedValue({
        data: mockSubjects,
      } as never);

      render(
        <MemoryRouter>
          <SubjectManagement />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Loading subjects/i)
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(
          screen.getByText("Mathematics")
        ).toBeInTheDocument();

        expect(screen.getByText("Core")).toBeInTheDocument();

        expect(screen.getByText("BCA")).toBeInTheDocument();
      });
    });

    test("shows no subjects found message", async () => {
      vi.mocked(getAllSubjects).mockResolvedValue({
        data: [],
      } as never);

      render(
        <MemoryRouter>
          <SubjectManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/No subjects found/i)
        ).toBeInTheDocument();
      });
    });

    test("deletes subject successfully", async () => {
      vi.mocked(getAllSubjects).mockResolvedValue({
        data: mockSubjects,
      } as never);

      vi.mocked(deleteSubject).mockResolvedValue(
        {} as never
      );

      vi.mocked(globalThis.confirm).mockReturnValue(true);

      render(
        <MemoryRouter>
          <SubjectManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Mathematics")
        ).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(deleteSubject).toHaveBeenCalledWith(1);

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Subject deleted successfully"
        );
      });
    });

    test("shows delete failure alert", async () => {
      vi.mocked(getAllSubjects).mockResolvedValue({
        data: mockSubjects,
      } as never);

      vi.mocked(deleteSubject).mockRejectedValue(
        new Error("Failed")
      );

      vi.mocked(globalThis.confirm).mockReturnValue(true);

      render(
        <MemoryRouter>
          <SubjectManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Mathematics")
        ).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(globalThis.alert).toHaveBeenCalledWith(
          "Failed to delete subject"
        );
      });
    });

    test("cancels delete when confirmation rejected", async () => {
      vi.mocked(getAllSubjects).mockResolvedValue({
        data: mockSubjects,
      } as never);

      vi.mocked(globalThis.confirm).mockReturnValue(false);

      render(
        <MemoryRouter>
          <SubjectManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Mathematics")
        ).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      expect(deleteSubject).not.toHaveBeenCalled();
    });
  });

  describe("AddSubject Component", () => {
    const mockCourses = [
      {
        id: 1,
        name: "BCA",
      },
      {
        id: 2,
        name: "MCA",
      },
    ];

    test("creates subject successfully", async () => {
      vi.mocked(getAllCourses).mockResolvedValue({
        data: mockCourses,
      } as never);

      vi.mocked(createSubject).mockResolvedValue(
        {} as never
      );

      render(
        <MemoryRouter>
          <AddSubject />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("option", {
            name: "BCA",
          })
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Subject Name"),
        {
          target: {
            value: "Physics",
            name: "name",
          },
        }
      );

      const selects = screen.getAllByRole("combobox");

      fireEvent.change(selects[0], {
        target: {
          value: "Core",
          name: "type",
        },
      });

      fireEvent.change(selects[1], {
        target: {
          value: "1",
          name: "course_id",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /create subject/i,
        })
      );

      await waitFor(() => {
        expect(createSubject).toHaveBeenCalledWith({
          name: "Physics",
          type: "Core",
          course_id: 1,
        });

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Subject created successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/subject-management"
        );
      });
    });

    test("shows validation alert when course not selected", async () => {
      vi.mocked(getAllCourses).mockResolvedValue({
        data: mockCourses,
      } as never);

      render(
        <MemoryRouter>
          <AddSubject />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", {
            name: /create subject/i,
          })
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Subject Name"),
        {
          target: {
            value: "Physics",
            name: "name",
          },
        }
      );

      const selects = screen.getAllByRole("combobox");

      fireEvent.change(selects[0], {
        target: {
          value: "Core",
          name: "type",
        },
      });

      fireEvent.submit(
        screen.getByRole("button", {
          name: /create subject/i,
        })
      );

      await waitFor(() => {
        expect(globalThis.alert).toHaveBeenCalledWith(
          "Please select a valid course allocation."
        );
      });
    });
  });

  describe("EditSubject Component", () => {
    const mockSubject = [
      {
        id: 1,
        name: "Mathematics",
        type: "Core",
        course_id: 10,
      },
    ];

    test("loads subject and updates successfully", async () => {
      vi.mocked(getSubjectById).mockResolvedValue({
        data: mockSubject,
      } as never);

      vi.mocked(updateSubject).mockResolvedValue(
        {} as never
      );

      render(
        <MemoryRouter initialEntries={["/subject/edit/1"]}>
          <Routes>
            <Route
              path="/subject/edit/:id"
              element={<EditSubject />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("Mathematics")
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Subject Name"),
        {
          target: {
            value: "Physics",
            name: "name",
          },
        }
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /update subject/i,
        })
      );

      await waitFor(() => {
        expect(updateSubject).toHaveBeenCalledWith(1, {
          id: 1,
          name: "Physics",
          type: "Core",
          course_id: 10,
        });

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Subject updated successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/subject/management"
        );
      });
    });

    test("shows update failure alert", async () => {
      vi.mocked(getSubjectById).mockResolvedValue({
        data: mockSubject,
      } as never);

      vi.mocked(updateSubject).mockRejectedValue(
        new Error("Failed")
      );

      render(
        <MemoryRouter initialEntries={["/subject/edit/1"]}>
          <Routes>
            <Route
              path="/subject/edit/:id"
              element={<EditSubject />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("Mathematics")
        ).toBeInTheDocument();
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /update subject/i,
        })
      );

      await waitFor(() => {
        expect(globalThis.alert).toHaveBeenCalledWith(
          "Failed to update subject"
        );
      });
    });
  });
});