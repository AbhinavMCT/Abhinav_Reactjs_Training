import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";
import ExamManagement from "../pages/admin/ExamManagement.tsx";
import AddExam from "../pages/exam/AddExam.tsx";
import EditExam from "../pages/exam/EditExam.tsx";

vi.mock("../services/ExamApi.ts", () => ({
  getAllExams: vi.fn(),
  deleteExam: vi.fn(),
  createExam: vi.fn(),
  getExamById: vi.fn(),
  updateExam: vi.fn(),
}));

vi.mock("../services/CourseApi.ts", () => ({
  getAllCourses: vi.fn(),
}));

import {
  getAllExams,
  deleteExam,
  createExam,
  getExamById,
  updateExam,
} from "../services/ExamApi.ts";

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

describe("Exam Module Test Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    globalThis.alert = vi.fn();

    globalThis.confirm = vi.fn();
  });

  describe("ExamManagement Component", () => {
    const mockExams = [
      {
        id: 1,
        name: "Mid Exam",
        semester: 1,
        exam_date: "2026-05-25",
        course_id: 10,
      },
    ];

    test("renders exam data", async () => {
      vi.mocked(getAllExams).mockResolvedValue({
        data: mockExams,
      } as never);

      render(
        <MemoryRouter>
          <ExamManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Mid Exam/i)
        ).toBeInTheDocument();
      });

      expect(screen.getByText("10")).toBeInTheDocument();
    });

    test("deletes exam successfully", async () => {
      vi.mocked(getAllExams).mockResolvedValue({
        data: mockExams,
      } as never);

      vi.mocked(deleteExam).mockResolvedValue(
        {} as never
      );

      vi.mocked(globalThis.confirm).mockReturnValue(true);

      render(
        <MemoryRouter>
          <ExamManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Mid Exam/i)
        ).toBeInTheDocument();
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /delete/i,
        })
      );

      await waitFor(() => {
        expect(deleteExam).toHaveBeenCalledWith(1);
      });
    });

    test("cancels delete when confirmation rejected", async () => {
      vi.mocked(getAllExams).mockResolvedValue({
        data: mockExams,
      } as never);

      vi.mocked(globalThis.confirm).mockReturnValue(false);

      render(
        <MemoryRouter>
          <ExamManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Mid Exam/i)
        ).toBeInTheDocument();
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /delete/i,
        })
      );

      expect(deleteExam).not.toHaveBeenCalled();
    });
  });

  describe("AddExam Component", () => {
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

    test("creates exam successfully", async () => {
      vi.mocked(getAllCourses).mockResolvedValue({
        data: mockCourses,
      } as never);

      vi.mocked(createExam).mockResolvedValue(
        {} as never
      );

      render(
        <MemoryRouter>
          <AddExam />
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
        screen.getByPlaceholderText("Exam Name"),
        {
          target: {
            value: "Final Exam",
            name: "name",
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText("Semester"),
        {
          target: {
            value: "2",
            name: "semester",
          },
        }
      );

      const dateInput = document.querySelector(
        'input[name="exam_date"]'
      ) as HTMLInputElement;

      fireEvent.change(dateInput, {
        target: {
          value: "2026-06-10",
          name: "exam_date",
        },
      });

      const selectInput = document.querySelector(
        'select[name="course_id"]'
      ) as HTMLSelectElement;

      fireEvent.change(selectInput, {
        target: {
          value: "1",
          name: "course_id",
        },
      });

      fireEvent.submit(
        screen.getByRole("button", {
          name: /create exam/i,
        })
      );

      await waitFor(() => {
        expect(createExam).toHaveBeenCalledWith({
          name: "Final Exam",
          semester: 2,
          exam_date: "2026-06-10",
          course_id: 1,
        });

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Exam created successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/exam-management"
        );
      });
    });

    test("shows validation alert when course not selected", async () => {
      vi.mocked(getAllCourses).mockResolvedValue({
        data: mockCourses,
      } as never);

      render(
        <MemoryRouter>
          <AddExam />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", {
            name: /create exam/i,
          })
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Exam Name"),
        {
          target: {
            value: "Internal Exam",
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText("Semester"),
        {
          target: {
            value: "1",
          },
        }
      );

      fireEvent.change(
        document.querySelector(
          'input[name="exam_date"]'
        ) as HTMLInputElement,
        {
          target: {
            value: "2026-06-10",
          },
        }
      );

      fireEvent.change(
        document.querySelector(
          'select[name="course_id"]'
        ) as HTMLSelectElement,
        {
          target: {
            value: "0",
          },
        }
      );

      fireEvent.submit(
        screen.getByRole("button", {
          name: /create exam/i,
        })
      );

      await waitFor(() => {
        expect(globalThis.alert).toHaveBeenCalledWith(
          "Please select a valid course."
        );
      });
    });
  });

  describe("EditExam Component", () => {
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

    const mockExam = [
      {
        id: 1,
        name: "Mid Exam",
        semester: 1,
        exam_date: "2026-05-25",
        course_id: 2,
      },
    ];

    test("loads exam and updates successfully", async () => {
      vi.mocked(getExamById).mockResolvedValue({
        data: mockExam,
      } as never);

      vi.mocked(getAllCourses).mockResolvedValue({
        data: mockCourses,
      } as never);

      vi.mocked(updateExam).mockResolvedValue(
        {} as never
      );

      render(
        <MemoryRouter initialEntries={["/exam/edit/1"]}>
          <Routes>
            <Route
              path="/exam/edit/:id"
              element={<EditExam />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("Mid Exam")
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Exam Name"),
        {
          target: {
            value: "Updated Exam",
          },
        }
      );

      fireEvent.submit(
        screen.getByRole("button", {
          name: /update exam/i,
        })
      );

      await waitFor(() => {
        expect(updateExam).toHaveBeenCalled();

        expect(globalThis.alert).toHaveBeenCalledWith(
          "Exam updated successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/exam/management"
        );
      });
    });

    test("shows validation alert when course is invalid", async () => {
      vi.mocked(getExamById).mockResolvedValue({
        data: mockExam,
      } as never);

      vi.mocked(getAllCourses).mockResolvedValue({
        data: mockCourses,
      } as never);

      render(
        <MemoryRouter initialEntries={["/exam/edit/1"]}>
          <Routes>
            <Route
              path="/exam/edit/:id"
              element={<EditExam />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("Mid Exam")
        ).toBeInTheDocument();
      });

      fireEvent.change(
        document.querySelector(
          'select[name="course_id"]'
        ) as HTMLSelectElement,
        {
          target: {
            value: "0",
          },
        }
      );

      fireEvent.submit(
        screen.getByRole("button", {
          name: /update exam/i,
        })
      );

      await waitFor(() => {
        expect(globalThis.alert).toHaveBeenCalledWith(
          "Please assign a valid course."
        );
      });
    });
  });
});