import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import ExamManagement from "../pages/admin/ExamManagement.tsx";
import AddExam from "../pages/exam/AddExam.tsx";
import EditExam from "../pages/exam/EditExam.tsx";

jest.mock("../services/ExamApi.ts", () => ({
  getAllExams: jest.fn(),
  deleteExam: jest.fn(),
  createExam: jest.fn(),
  getExamById: jest.fn(),
  updateExam: jest.fn(),
}));

jest.mock("../services/CourseApi.ts", () => ({
  getAllCourses: jest.fn(),
}));

import {
  getAllExams,
  deleteExam,
  createExam,
  getExamById,
  updateExam,
} from "../services/ExamApi.ts";

import { getAllCourses } from "../services/CourseApi.ts";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Exam Module Test Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.alert = jest.fn();

    window.confirm = jest.fn();
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
      (getAllExams as jest.Mock).mockResolvedValue({
        data: mockExams,
      });

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
      (getAllExams as jest.Mock).mockResolvedValue({
        data: mockExams,
      });

      (deleteExam as jest.Mock).mockResolvedValue({});

      (window.confirm as jest.Mock).mockReturnValue(true);

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
      (getAllExams as jest.Mock).mockResolvedValue({
        data: mockExams,
      });

      (window.confirm as jest.Mock).mockReturnValue(false);

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
      (getAllCourses as jest.Mock).mockResolvedValue({
        data: mockCourses,
      });

      (createExam as jest.Mock).mockResolvedValue({});

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

      expect(selectInput.value).toBe("1");

      fireEvent.click(
        screen.getByRole("button", {
          name: /create exam/i,
        })
      );

      await waitFor(() => {
        expect(createExam).toHaveBeenCalledTimes(1);

        expect(createExam).toHaveBeenCalledWith({
          name: "Final Exam",
          semester: 2,
          exam_date: "2026-06-10",
          course_id: 1,
        });

        expect(window.alert).toHaveBeenCalledWith(
          "Exam created successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/exam-management"
        );
      });
    });

    test("shows validation alert when course not selected", async () => {
      (getAllCourses as jest.Mock).mockResolvedValue({
        data: mockCourses,
      });

      render(
        <MemoryRouter>
          <AddExam />
        </MemoryRouter>
      );

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
        expect(window.alert).toHaveBeenCalledWith(
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
      (getExamById as jest.Mock).mockResolvedValue({
        data: mockExam,
      });

      (getAllCourses as jest.Mock).mockResolvedValue({
        data: mockCourses,
      });

      (updateExam as jest.Mock).mockResolvedValue({});

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

        expect(window.alert).toHaveBeenCalledWith(
          "Exam updated successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/exam/management"
        );
      });
    });

    test("shows validation alert when course is invalid", async () => {
      (getExamById as jest.Mock).mockResolvedValue({
        data: mockExam,
      });

      (getAllCourses as jest.Mock).mockResolvedValue({
        data: mockCourses,
      });

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
        expect(window.alert).toHaveBeenCalledWith(
          "Please assign a valid course."
        );
      });
    });
  });
});