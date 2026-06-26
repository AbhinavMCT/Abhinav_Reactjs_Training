import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "./setupMocks.tsx";
import { MemoryRouter } from "react-router-dom";
import SubjectManagement from "../pages/admin/SubjectManagement.tsx";
import AddSubject from "../pages/subjects/Subjectpage.tsx";
import * as SubjectApi from "../services/SubjectApi.ts";

vi.mock("../services/SubjectApi");


describe("Subject Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SubjectManagement (List)", () => {
    it("fetches and displays subjects", async () => {
      vi.mocked(SubjectApi.getAllSubjects).mockResolvedValue({
        data: {
          subject: [
            { id: 1, name: "Physics", type: "Core", course_name: "Science" },
          ],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <SubjectManagement />
          </MemoryRouter>,
        );
      });

      expect(await screen.findByText("Physics")).toBeDefined();
    });

    it("handles subject deletion", async () => {
      vi.mocked(SubjectApi.getAllSubjects).mockResolvedValue({
        data: {
          subject: [{ id: 1, name: "Physics" }],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);
      vi.mocked(SubjectApi.deleteSubject).mockResolvedValue({} as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <SubjectManagement />
          </MemoryRouter>,
        );
      });

      fireEvent.click(screen.getByText("Delete"));
      await act(async () => {
        fireEvent.click(screen.getByText("Confirm"));
      });

      expect(SubjectApi.deleteSubject).toHaveBeenCalledWith(1);
    });
  });

  describe("AddSubject (Form)", () => {
    it("loads courses for dropdown on mount", async () => {
      vi.mocked(SubjectApi.getAllCourses).mockResolvedValue({
        data: { course: [{ id: 1, name: "Computer Science" }] },
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <AddSubject navigate={vi.fn()} isEditMode={false} />
          </MemoryRouter>,
        );
      });

      expect(SubjectApi.getAllCourses).toHaveBeenCalled();
    });

    it("submits form data correctly", async () => {
      vi.mocked(SubjectApi.getAllCourses).mockResolvedValue({
        data: {
          course: [{ id: 1, name: "Computer Science" }],
        },
      } as any);

      vi.mocked(SubjectApi.createSubject).mockResolvedValue({} as any);

      const navigate = vi.fn();

      await act(async () => {
        render(
          <MemoryRouter>
            <AddSubject navigate={navigate} isEditMode={false} />
          </MemoryRouter>,
        );
      });

      fireEvent.change(screen.getByLabelText(/Subject Name/i), {
        target: { value: "Math" },
      });

      fireEvent.change(screen.getByLabelText(/Course/i), {
        target: { value: "1" },
      });

      fireEvent.change(screen.getByLabelText(/Type/i), {
        target: { value: "Core" },
      });

      const submitButton = screen.getByRole("button", {
        name: /create subject/i,
      });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(SubjectApi.createSubject).toHaveBeenCalled();
    });
  });
});
