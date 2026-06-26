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
import AllocateStudentCourse from "../pages/admin/Allocatestudentcourse.tsx";
import StudentCoursePage  from "../pages/studentcourse/StudentCoursePage.tsx";
import * as StudentCourseApi from "../services/StudentCourseApi.ts";
import * as StudentApi from "../services/StudentApi.ts";
import * as CourseApi from "../services/CourseApi.ts";

vi.mock("../services/StudentCourseApi");
vi.mock("../services/StudentApi");
vi.mock("../services/CourseApi");

vi.mock("../components/StudentCourseForm.tsx", () => ({
  default: ({
    formData,
    handleSubmit,
    handleChange,
    students,
    courses,
    buttonText,
  }: any) => (
    <form onSubmit={handleSubmit}>
      <select
        aria-label="Student"
        name="student_id"
        value={formData.student_id}
        onChange={handleChange}
      >
        <option value={0}>Select Student</option>
        {students.map((s: any) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Course"
        name="course_id"
        value={formData.course_id}
        onChange={handleChange}
      >
        <option value={0}>Select Course</option>
        {courses.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button type="submit">{buttonText}</button>
    </form>
  ),
}));

describe("StudentCourse Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AllocateStudentCourse (List)", () => {
    it("fetches and displays allocated records", async () => {
      vi.mocked(StudentCourseApi.getStudentCourse).mockResolvedValue({
        data: {
          studentcourse: [
            { id: 1, student_name: "Alice", course_name: "Math" },
          ],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <AllocateStudentCourse />
          </MemoryRouter>,
        );
      });

      expect(await screen.findByText("Alice")).toBeDefined();
    });

    it("handles deletion", async () => {
      vi.mocked(StudentCourseApi.getStudentCourse).mockResolvedValue({
        data: {
          studentcourse: [{ id: 1, student_name: "Alice" }],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);
      vi.mocked(StudentCourseApi.deleteStudentCourse).mockResolvedValue(
        {} as any,
      );

      await act(async () => {
        render(
          <MemoryRouter>
            <AllocateStudentCourse />
          </MemoryRouter>,
        );
      });

      fireEvent.click(screen.getByText("Delete"));
      await act(async () => {
        fireEvent.click(screen.getByText("Confirm"));
      });

      expect(StudentCourseApi.deleteStudentCourse).toHaveBeenCalledWith(1);
    });
  });

  describe("StudentCoursePage (Create)", () => {
    it("loads student and course dropdown data", async () => {
      vi.mocked(StudentApi.getAllStudents).mockResolvedValue({
        data: { students: [{ id: 1, name: "John" }] },
      } as any);
      vi.mocked(CourseApi.getAllCourses).mockResolvedValue({
        data: { course: [{ id: 1, name: "CS101" }] },
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <StudentCoursePage navigate={vi.fn()} isEditMode={false} />
          </MemoryRouter>,
        );
      });

      expect(StudentApi.getAllStudents).toHaveBeenCalled();
      expect(CourseApi.getAllCourses).toHaveBeenCalled();
    });

    it("creates student allocation", async () => {
      vi.mocked(StudentApi.getAllStudents).mockResolvedValue({
        data: {
          students: [{ id: 1, name: "John" }],
        },
      } as any);

      vi.mocked(CourseApi.getAllCourses).mockResolvedValue({
        data: {
          course: [{ id: 1, name: "BCA" }],
        },
      } as any);

      vi.mocked(StudentCourseApi.createStudentCourse).mockResolvedValue(
        {} as any,
      );

      const navigate = vi.fn();

      render(
        <MemoryRouter>
          <StudentCoursePage navigate={navigate} isEditMode={false} />
        </MemoryRouter>,
      );

      fireEvent.change(await screen.findByLabelText("Student"), {
        target: {
          value: "1",
        },
      });

      fireEvent.change(screen.getByLabelText("Course"), {
        target: {
          value: "1",
        },
      });

      fireEvent.submit(
  screen.getByRole("button", { name: /add/i }).closest("form")!
);

      await waitFor(() => {
        expect(StudentCourseApi.createStudentCourse).toHaveBeenCalled();
      });

    });

    it("updates allocation", async () => {
      vi.mocked(StudentApi.getAllStudents).mockResolvedValue({
        data: {
          students: [{ id: 1, name: "John" }],
        },
      } as any);

      vi.mocked(CourseApi.getAllCourses).mockResolvedValue({
        data: {
          course: [{ id: 1, name: "BCA" }],
        },
      } as any);

      vi.mocked(StudentCourseApi.getStudentcoursebyId).mockResolvedValue({
        data: [
          {
            id: 1,
            student_id: 1,
            course_id: 1,
          },
        ],
      } as any);

      vi.mocked(StudentCourseApi.updateStudentCourse).mockResolvedValue(
        {} as any,
      );

      const navigate = vi.fn();

      render(
        <MemoryRouter>
          <StudentCoursePage id={1} navigate={navigate} isEditMode />
        </MemoryRouter>,
      );


fireEvent.submit(
  screen.getByRole("button", { name: /edit/i }).closest("form")!
);

await waitFor(() => {
  expect(StudentCourseApi.updateStudentCourse).toHaveBeenCalled();
});

      
    });

    it("handles load failure", async () => {
      vi.mocked(StudentApi.getAllStudents).mockRejectedValue(
        new Error("Failed to fetch students"),
      );

      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <MemoryRouter>
          <StudentCoursePage navigate={vi.fn()} isEditMode={false} />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });
    });

    it("handles submit failure", async () => {
      vi.mocked(StudentApi.getAllStudents).mockResolvedValue({
        data: {
          students: [{ id: 1, name: "John" }],
        },
      } as any);

      vi.mocked(CourseApi.getAllCourses).mockResolvedValue({
        data: {
          course: [{ id: 1, name: "BCA" }],
        },
      } as any);

      vi.mocked(StudentApi.getAllStudents).mockRejectedValue(
        new Error("Failed to fetch students"),
      );

      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <MemoryRouter>
          <StudentCoursePage navigate={vi.fn()} isEditMode={false} />
        </MemoryRouter>,
      );

      fireEvent.submit(await screen.findByRole("button"));

      await waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
