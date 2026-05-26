import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import CourseManagement from "../pages/admin/CourseManagement.tsx";
import AddCourse from "../pages/course/AddCourse.tsx";
import EditCourse from "../pages/course/EditCourse.tsx";

vi.mock("../services/CourseApi.ts", () => ({
  getAllCourses: vi.fn(),
  deleteCourse: vi.fn(),
  createCourse: vi.fn(),
  getCourseById: vi.fn(),
  updateCourse: vi.fn(),
  getAllDepartments: vi.fn(),
}));

import {
  getAllCourses,
  deleteCourse,
  createCourse,
  getCourseById,
  updateCourse,
  getAllDepartments,
} from "../services/CourseApi.ts";

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

describe("Course Module Test Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    globalThis.alert = vi.fn();

    globalThis.confirm = vi.fn();
  });

  describe("CourseManagement Component", () => {
    const mockCourses = [
      {
        id: 1,
        name: "BCA",
        dep_id: 10,
        department_name: "Computer Science",
      },
    ];

    test("renders course data", async () => {
      vi.mocked(getAllCourses).mockResolvedValue({
        data: mockCourses,
      } as never);

      render(
        <MemoryRouter>
          <CourseManagement />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Loading courses/i)
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("BCA")).toBeInTheDocument();

        expect(
          screen.getByText("Computer Science")
        ).toBeInTheDocument();
      });
    });

    test("shows no courses found message", async () => {
      vi.mocked(getAllCourses).mockResolvedValue({
        data: [],
      } as never);

      render(
        <MemoryRouter>
          <CourseManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/No courses found/i)
        ).toBeInTheDocument();
      });
    });

    test("deletes course successfully", async () => {
      vi.mocked(getAllCourses).mockResolvedValue({
        data: mockCourses,
      } as never);

      vi.mocked(deleteCourse).mockResolvedValue(
        {} as never
      );

      vi.mocked(globalThis.confirm).mockReturnValue(true);

      render(
        <MemoryRouter>
          <CourseManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("BCA")).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(deleteCourse).toHaveBeenCalledWith(1);

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Course deleted successfully"
        );
      });
    });

    test("shows delete failure alert", async () => {
      vi.mocked(getAllCourses).mockResolvedValue({
        data: mockCourses,
      } as never);

      vi.mocked(deleteCourse).mockRejectedValue(
        new Error("Failed")
      );

      vi.mocked(globalThis.confirm).mockReturnValue(true);

      render(
        <MemoryRouter>
          <CourseManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("BCA")).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(globalThis.alert).toHaveBeenCalledWith(
          "Failed to delete course"
        );
      });
    });

    test("cancels delete when confirmation rejected", async () => {
      vi.mocked(getAllCourses).mockResolvedValue({
        data: mockCourses,
      } as never);

      vi.mocked(globalThis.confirm).mockReturnValue(false);

      render(
        <MemoryRouter>
          <CourseManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("BCA")).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      expect(deleteCourse).not.toHaveBeenCalled();
    });
  });

  describe("AddCourse Component", () => {
    const mockDepartments = [
      {
        id: 1,
        name: "Computer Science",
      },
      {
        id: 2,
        name: "Commerce",
      },
    ];

    test("creates course successfully", async () => {
      vi.mocked(getAllDepartments).mockResolvedValue({
        data: mockDepartments,
      } as never);

      vi.mocked(createCourse).mockResolvedValue(
        {} as never
      );

      render(
        <MemoryRouter>
          <AddCourse />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("option", {
            name: "Computer Science",
          })
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Course Name"),
        {
          target: {
            value: "MCA",
            name: "name",
          },
        }
      );

      const selectInput = document.querySelector(
        'select[name="dep_id"]'
      ) as HTMLSelectElement;

      fireEvent.change(selectInput, {
        target: {
          value: "1",
          name: "dep_id",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /create course/i,
        })
      );

      await waitFor(() => {
        expect(createCourse).toHaveBeenCalledWith({
          name: "MCA",
          dep_id: 1,
        });

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Course created successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/course/management"
        );
      });
    });

    test("shows create failure alert", async () => {
      vi.mocked(getAllDepartments).mockResolvedValue({
        data: mockDepartments,
      } as never);

      vi.mocked(createCourse).mockRejectedValue(
        new Error("Failed")
      );

      render(
        <MemoryRouter>
          <AddCourse />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Course Name")
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Course Name"),
        {
          target: {
            value: "MBA",
            name: "name",
          },
        }
      );

      const selectInput = document.querySelector(
        'select[name="dep_id"]'
      ) as HTMLSelectElement;

      fireEvent.change(selectInput, {
        target: {
          value: "1",
          name: "dep_id",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /create course/i,
        })
      );

      await waitFor(() => {
        expect(globalThis.alert).toHaveBeenCalledWith(
          "Failed to create course"
        );
      });
    });
  });

  describe("EditCourse Component", () => {
    const mockDepartments = [
      {
        id: 1,
        name: "Computer Science",
      },
      {
        id: 2,
        name: "Commerce",
      },
    ];

    const mockCourse = [
      {
        id: 1,
        name: "BCA",
        dep_id: 1,
      },
    ];

    test("loads course and updates successfully", async () => {
      vi.mocked(getCourseById).mockResolvedValue({
        data: mockCourse,
      } as never);

      vi.mocked(getAllDepartments).mockResolvedValue({
        data: mockDepartments,
      } as never);

      vi.mocked(updateCourse).mockResolvedValue(
        {} as never
      );

      render(
        <MemoryRouter initialEntries={["/course/edit/1"]}>
          <Routes>
            <Route
              path="/course/edit/:id"
              element={<EditCourse />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("BCA")
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Course Name"),
        {
          target: {
            value: "MCA",
            name: "name",
          },
        }
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /update course/i,
        })
      );

      await waitFor(() => {
        expect(updateCourse).toHaveBeenCalledWith(1, {
          id: 1,
          name: "MCA",
          dep_id: 1,
        });

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Course updated successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/course/management"
        );
      });
    });

    test("shows update failure alert", async () => {
      vi.mocked(getCourseById).mockResolvedValue({
        data: mockCourse,
      } as never);

      vi.mocked(getAllDepartments).mockResolvedValue({
        data: mockDepartments,
      } as never);

      vi.mocked(updateCourse).mockRejectedValue(
        new Error("Failed")
      );

      render(
        <MemoryRouter initialEntries={["/course/edit/1"]}>
          <Routes>
            <Route
              path="/course/edit/:id"
              element={<EditCourse />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("BCA")
        ).toBeInTheDocument();
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /update course/i,
        })
      );

      await waitFor(() => {
        expect(globalThis.alert).toHaveBeenCalledWith(
          "Failed to update course"
        );
      });
    });
  });
});