import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "./setupMocks.tsx";
import { MemoryRouter } from "react-router-dom";

import ExamManagement from "../pages/admin/ExamManagement.tsx";
import Exampage from "../pages/exam/Exampage.tsx";

import * as ExamApi from "../services/ExamApi.ts";

vi.mock("../services/ExamApi.ts");

describe("Exam Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ExamManagement", () => {
    it("renders exams", async () => {
      vi.mocked(ExamApi.getAllExams).mockResolvedValue({
        data: {
          exam: [
            {
              id: 1,
              name: "Midterm",
              exam_type: "Internal",
              semester: 1,
              total_mark: 100,
            },
          ],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);

      render(
        <MemoryRouter>
          <ExamManagement />
        </MemoryRouter>,
      );

      expect(await screen.findByText("Midterm")).toBeInTheDocument();
    });

    it("deletes exam", async () => {
      vi.mocked(ExamApi.getAllExams).mockResolvedValue({
        data: {
          exam: [
            {
              id: 1,
              name: "Midterm",
              exam_type: "Internal",
              semester: 1,
              total_mark: 100,
            },
          ],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);

      vi.mocked(ExamApi.deleteExam).mockResolvedValue({} as any);

      render(
        <MemoryRouter>
          <ExamManagement />
        </MemoryRouter>,
      );

      fireEvent.click(await screen.findByText("Delete"));

      fireEvent.click(await screen.findByText("Confirm"));

      await waitFor(() => {
        expect(ExamApi.deleteExam).toHaveBeenCalledWith(1);
      });
    });
  });

  describe("Exampage", () => {
    beforeEach(() => {
      vi.mocked(ExamApi.getallCourse).mockResolvedValue({
        data: {
          course: [
            {
              id: 1,
              name: "BCA",
            },
          ],
        },
      } as any);
    });

    it("loads courses", async () => {
      render(
        <MemoryRouter>
          <Exampage />
        </MemoryRouter>,
      );

      expect(
        await screen.findByRole("option", {
          name: "BCA",
        }),
      ).toBeInTheDocument();
    });

    it("renders form fields", async () => {
      render(
        <MemoryRouter>
          <Exampage />
        </MemoryRouter>,
      );

      expect(screen.getByLabelText(/Exam Name/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/Semester/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/Exam Date/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/Course/i)).toBeInTheDocument();
    });

    it("creates exam", async () => {
      vi.mocked(ExamApi.createExam).mockResolvedValue({
        data: {},
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <Exampage />
          </MemoryRouter>,
        );
      });

      // Wait for course loading
      await screen.findByRole("option", {
        name: "BCA",
      });

      fireEvent.change(screen.getByLabelText(/Exam Name/i), {
        target: {
          value: "Midterm",
        },
      });

      fireEvent.change(screen.getByLabelText(/Exam Type/i), {
        target: {
          value: "Internal",
        },
      });

      fireEvent.change(screen.getByLabelText(/Semester/i), {
        target: {
          value: "1",
        },
      });

      fireEvent.change(screen.getByLabelText(/Exam Date/i), {
        target: {
          value: "2030-12-31",
        },
      });

      fireEvent.change(screen.getByLabelText(/Total Mark/i), {
        target: {
          value: "100",
        },
      });

      fireEvent.change(screen.getByLabelText(/Course/i), {
        target: {
          value: "1",
        },
      });

      fireEvent.submit(
        screen
          .getByRole("button", {
            name: /add exam/i,
          })
          .closest("form")!,
      );

      await waitFor(() => {
        expect(ExamApi.createExam).toHaveBeenCalled();
      });
    });

    it("shows validation errors", async () => {
      render(
        <MemoryRouter>
          <Exampage />
        </MemoryRouter>,
      );

      fireEvent.submit(
        screen.getByRole("button", { name: /add exam/i }).closest("form")!,
      );

      expect(
        await screen.findByText(/Exam name is required/i),
      ).toBeInTheDocument();

      expect(screen.getByText(/Please select a course/i)).toBeInTheDocument();
    });

    it("shows exam name length validation", async () => {
      render(
        <MemoryRouter>
          <Exampage />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/Exam Name/i), {
        target: { value: "AB" },
      });

      fireEvent.submit(
        screen.getByRole("button", { name: /add exam/i }).closest("form")!,
      );

      expect(
        await screen.findByText(/at least 3 characters/i),
      ).toBeInTheDocument();
    });

    it("rejects past exam date", async () => {
      render(
        <MemoryRouter>
          <Exampage />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/Exam Date/i), {
        target: {
          value: "2020-01-01",
        },
      });

      fireEvent.submit(
        screen.getByRole("button", { name: /add exam/i }).closest("form")!,
      );

      expect(
        await screen.findByText(/cannot be in the past/i),
      ).toBeInTheDocument();
    });

    it("handles course loading failure", async () => {
      vi.mocked(ExamApi.getallCourse).mockRejectedValue(
        new Error("Course Error"),
      );

      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <MemoryRouter>
          <Exampage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });

      spy.mockRestore();
    });

    it("handles create exam failure", async () => {
      vi.mocked(ExamApi.createExam).mockRejectedValue(
        new Error("Create Error"),
      );

      render(
        <MemoryRouter>
          <Exampage />
        </MemoryRouter>,
      );

      await screen.findByRole("option", { name: "BCA" });

      fireEvent.change(screen.getByLabelText(/Exam Name/i), {
        target: { value: "Midterm" },
      });

      fireEvent.change(screen.getByLabelText(/Exam Type/i), {
        target: { value: "Internal" },
      });

      fireEvent.change(screen.getByLabelText(/Semester/i), {
        target: { value: "1" },
      });

      fireEvent.change(screen.getByLabelText(/Exam Date/i), {
        target: { value: "2030-01-01" },
      });

      fireEvent.change(screen.getByLabelText(/Total Mark/i), {
        target: { value: "100" },
      });

      fireEvent.change(screen.getByLabelText(/Course/i), {
        target: { value: "1" },
      });

      fireEvent.submit(
        screen.getByRole("button", { name: /add exam/i }).closest("form")!,
      );

      await waitFor(() => {
        expect(ExamApi.createExam).toHaveBeenCalled();
      });
    });
  });
});
