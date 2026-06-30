import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import MarkView from "../pages/mark/MarkView.tsx";
import MarkPage from "../pages/mark/MarkPage.tsx";
import * as MarkApi from "../services/MarkApi.ts";

vi.mock("../services/MarkApi", () => ({
  getMarks: vi.fn(),
  deleteMarks: vi.fn(),
  createMark: vi.fn(),
  getAllStudents: vi.fn(),
  getAllSubjects: vi.fn(),
  getAllExams: vi.fn(),
  downloadStudentReport: vi.fn(),
}));

describe("Mark Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("MarkView", () => {
    it("fetches and displays marks", async () => {
      vi.mocked(MarkApi.getMarks).mockResolvedValue({
        data: {
          marks: [
            {
              id: 1,
              student_name: "John Doe",
              subject_name: "Math",
              mark: 85,
              grade: "A",
            },
          ],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <MarkView />
          </MemoryRouter>,
        );
      });

      expect(await screen.findByText("John Doe")).toBeDefined();
    });

    it("deletes a mark", async () => {
      vi.mocked(MarkApi.getMarks).mockResolvedValue({
        data: {
          marks: [{ id: 1, student_name: "John" }],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);
      vi.mocked(MarkApi.deleteMarks).mockResolvedValue({} as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <MarkView />
          </MemoryRouter>,
        );
      });

      fireEvent.click(await screen.findByText("Delete"));
      await act(async () => {
        fireEvent.click(screen.getByText("Confirm"));
      });

      expect(MarkApi.deleteMarks).toHaveBeenCalledWith(1);
    });
  });

  describe("MarkPage (Form)", () => {
    it("submits form with correct data", async () => {
      vi.mocked(MarkApi.getAllStudents).mockResolvedValue({
        data: {
          students: [
            {
              id: 1,
              name: "John Doe",
            },
          ],
        },
      } as any);

      vi.mocked(MarkApi.getAllSubjects).mockResolvedValue({
        data: [
          {
            id: 1,
            name: "Mathematics",
          },
        ],
      } as any);

      vi.mocked(MarkApi.getAllExams).mockResolvedValue({
        data: {
          exam: [
            {
              id: 1,
              name: "Mid Exam",
              total_mark: 100,
            },
          ],
        },
      } as any);

      vi.mocked(MarkApi.createMark).mockResolvedValue({} as any);

      render(
        <MemoryRouter>
          <MarkPage isEditMode={false} />
        </MemoryRouter>,
      );

      await screen.findByText("John Doe");

      fireEvent.change(screen.getByLabelText(/Student/i), {
        target: { value: "1" },
      });

      fireEvent.change(screen.getByLabelText(/Subject/i), {
        target: { value: "1" },
      });

      fireEvent.change(screen.getByLabelText(/Exam/i), {
        target: { value: "1" },
      });

      fireEvent.change(screen.getByLabelText(/Mark Obtained/i), {
        target: { value: "95" },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /add mark/i,
        }),
      );

      await waitFor(() => {
        expect(MarkApi.createMark).toHaveBeenCalled();
      });
    });

    it("handles getMarks api failure", async () => {
      vi.mocked(MarkApi.getMarks).mockRejectedValue(new Error("API Error"));

      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <MemoryRouter>
          <MarkView />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });
    });

    it("handles delete api failure", async () => {
      vi.mocked(MarkApi.getMarks).mockResolvedValue({
        data: {
          marks: [{ id: 1, student_name: "John" }],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);

      vi.mocked(MarkApi.deleteMarks).mockRejectedValue(
        new Error("Delete Failed"),
      );

      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <MemoryRouter>
          <MarkView />
        </MemoryRouter>,
      );

      fireEvent.click(await screen.findByText("Delete"));
      fireEvent.click(screen.getByText("Confirm"));

      await waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });
    });

    it("closes delete modal", async () => {
      vi.mocked(MarkApi.getMarks).mockResolvedValue({
        data: {
          marks: [{ id: 1, student_name: "John" }],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);

      render(
        <MemoryRouter>
          <MarkView />
        </MemoryRouter>,
      );

      fireEvent.click(await screen.findByText("Delete"));

      fireEvent.click(screen.getByText("Cancel"));

      expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
    });

    it("downloads pdf", async () => {
      vi.mocked(MarkApi.getMarks).mockResolvedValue({
        data: {
          marks: [
            {
              id: 1,
              student_id: 10,
              student_name: "John",
            },
          ],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);

      vi.mocked(MarkApi.downloadStudentReport).mockResolvedValue({
        data: new Blob(["pdf"]),
      } as any);

      globalThis.URL.createObjectURL = vi.fn(() => "blob:url");
      globalThis.URL.revokeObjectURL = vi.fn();

      render(
        <MemoryRouter>
          <MarkView />
        </MemoryRouter>,
      );

      fireEvent.click(await screen.findByText("PDF"));

      await waitFor(() => {
        expect(MarkApi.downloadStudentReport).toHaveBeenCalledWith(10);
      });
    });

    it("handles download failure", async () => {
      vi.mocked(MarkApi.getMarks).mockResolvedValue({
        data: {
          marks: [
            {
              id: 1,
              student_id: 10,
              student_name: "John",
            },
          ],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);

      vi.mocked(MarkApi.downloadStudentReport).mockRejectedValue(new Error());

      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <MemoryRouter>
          <MarkView />
        </MemoryRouter>,
      );

      fireEvent.click(await screen.findByText("PDF"));

      await waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });
    });

    it("filters by semester", async () => {
      vi.mocked(MarkApi.getMarks).mockResolvedValue({
        data: {
          marks: [],
          totalPages: 1,
          totalRecords: 0,
        },
      } as any);

      render(
        <MemoryRouter>
          <MarkView />
        </MemoryRouter>,
      );

      fireEvent.change(screen.getByLabelText(/Semester/i), {
        target: {
          value: "2",
        },
      });

      await waitFor(() => {
        expect(MarkApi.getMarks).toHaveBeenLastCalledWith(1, 5, "", 2);
      });
    });

    it("shows loading initially", () => {
      vi.mocked(MarkApi.getMarks).mockImplementation(
        () => new Promise(() => {}),
      );

      render(
        <MemoryRouter>
          <MarkView />
        </MemoryRouter>,
      );

      expect(screen.getByText(/Loading Marks/i)).toBeInTheDocument();
    });

    it("shows validation errors", async () => {
      vi.mocked(MarkApi.getAllStudents).mockResolvedValue({
        data: { students: [] },
      } as any);

      vi.mocked(MarkApi.getAllSubjects).mockResolvedValue({
        data: [],
      } as any);

      vi.mocked(MarkApi.getAllExams).mockResolvedValue({
        data: { exam: [] },
      } as any);

      render(
        <MemoryRouter>
          <MarkPage isEditMode={false} />
        </MemoryRouter>,
      );

      fireEvent.click(screen.getByRole("button", { name: /add mark/i }));

      expect(
        await screen.findByText(/Please select a student/i),
      ).toBeInTheDocument();

      expect(screen.getByText(/Please select a subject/i)).toBeInTheDocument();

      expect(screen.getByText(/Please select an exam/i)).toBeInTheDocument();

      expect(screen.getByText(/greater than 0/i)).toBeInTheDocument();
    });

    it("rejects mark greater than total mark", async () => {
      vi.mocked(MarkApi.getAllStudents).mockResolvedValue({
        data: { students: [{ id: 1, name: "John" }] },
      } as any);

      vi.mocked(MarkApi.getAllSubjects).mockResolvedValue({
        data: [{ id: 1, name: "Math" }],
      } as any);

      vi.mocked(MarkApi.getAllExams).mockResolvedValue({
        data: {
          exam: [
            {
              id: 1,
              name: "Mid",
              total_mark: 100,
            },
          ],
        },
      } as any);

      render(
        <MemoryRouter>
          <MarkPage isEditMode={false} />
        </MemoryRouter>,
      );

      await screen.findByText("John");

      fireEvent.change(screen.getByLabelText(/Student/i), {
        target: { value: "1" },
      });

      fireEvent.change(screen.getByLabelText(/Subject/i), {
        target: { value: "1" },
      });

      fireEvent.change(screen.getByLabelText(/Exam/i), {
        target: { value: "1" },
      });

      fireEvent.change(screen.getByLabelText(/Mark Obtained/i), {
        target: { value: "150" },
      });

      fireEvent.click(screen.getByRole("button", { name: /add mark/i }));

      expect(await screen.findByText(/cannot exceed 100/i)).toBeInTheDocument();
    });

    it("handles dropdown loading failure", async () => {
      vi.mocked(MarkApi.getAllStudents).mockRejectedValue(new Error("failed"));

      render(
        <MemoryRouter>
          <MarkPage isEditMode={false} />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(MarkApi.getAllStudents).toHaveBeenCalled();
      });
    });
  });
});
