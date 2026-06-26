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
import AllocateSubjectStaff from "../pages/admin/Allocatesubjectstaff.tsx";
import EditSubjectStaff from "../pages/subjectstaff/SubjectStaffAllocationPage.tsx";
import * as SubjectStaffApi from "../services/SubjectStaffApi.ts";
import * as StaffApi from "../services/StaffApi.ts";

vi.mock("../services/SubjectStaffApi");
vi.mock("../services/StaffApi");

vi.mock("../components/SubjectStaffForm.tsx", () => ({
  default: ({
    subjects,
    staffList,
    handleChange,
    handleSubmit,
    buttonText,
  }: any) => (
    <form onSubmit={handleSubmit}>
      <label htmlFor="subject">Subject</label>

      <select id="subject" name="subject_id" onChange={handleChange}>
        {subjects.map((s: any) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <label htmlFor="staff">Staff</label>

      <select id="staff" name="staff_id" onChange={handleChange}>
        {staffList.map((s: any) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <button type="submit">{buttonText}</button>
    </form>
  ),
}));

describe("SubjectStaff Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AllocateSubjectStaff (List)", () => {
    it("fetches and displays allocation list", async () => {
      vi.mocked(SubjectStaffApi.getAllSubjectStaff).mockResolvedValue({
        data: {
          staffsubject: [
            { id: 1, staff_name: "Dr. Smith", subject_name: "Physics" },
          ],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <AllocateSubjectStaff />
          </MemoryRouter>,
        );
      });

      expect(await screen.findByText("Dr. Smith")).toBeDefined();
      expect(screen.getByText("Physics")).toBeDefined();
    });

    it("handles deletion of allocation", async () => {
      vi.mocked(SubjectStaffApi.getAllSubjectStaff).mockResolvedValue({
        data: {
          staffsubject: [{ id: 1, staff_name: "Dr. Smith" }],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);
      vi.mocked(SubjectStaffApi.deleteSubjectStaff).mockResolvedValue(
        {} as any,
      );

      await act(async () => {
        render(
          <MemoryRouter>
            <AllocateSubjectStaff />
          </MemoryRouter>,
        );
      });

      fireEvent.click(screen.getByText("Delete"));
      await act(async () => {
        fireEvent.click(screen.getByText("Confirm"));
      });

      expect(SubjectStaffApi.deleteSubjectStaff).toHaveBeenCalledWith(1);
    });
  });

  describe("EditSubjectStaff (Form)", () => {
    it("loads subjects and staff list on mount", async () => {
      vi.mocked(SubjectStaffApi.getAllSubjects).mockResolvedValue({
        data: { subject: [{ id: 1, name: "Math" }] },
      } as any);
      vi.mocked(StaffApi.getAllStaff).mockResolvedValue({
        data: { staff: [{ id: 1, name: "Prof. Jones" }] },
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <EditSubjectStaff navigate={vi.fn()} isEditMode={false} />
          </MemoryRouter>,
        );
      });

      expect(SubjectStaffApi.getAllSubjects).toHaveBeenCalled();
      expect(StaffApi.getAllStaff).toHaveBeenCalled();
    });

    it("creates subject allocation", async () => {
      vi.mocked(SubjectStaffApi.getAllSubjects).mockResolvedValue({
        data: {
          subject: [{ id: 1, name: "Math" }],
        },
      } as any);

      vi.mocked(StaffApi.getAllStaff).mockResolvedValue({
        data: {
          staff: [{ id: 1, name: "John" }],
        },
      } as any);

      vi.mocked(SubjectStaffApi.createSubjectStaff).mockResolvedValue(
        {} as any,
      );

      const navigate = vi.fn();

      render(
        <MemoryRouter>
          <EditSubjectStaff navigate={navigate} isEditMode={false} />
        </MemoryRouter>,
      );

      fireEvent.change(await screen.findByLabelText("Subject"), {
        target: {
          value: "1",
        },
      });

      fireEvent.change(screen.getByLabelText("Staff"), {
        target: {
          value: "1",
        },
      });

      fireEvent.submit(screen.getByRole("button"));

      await waitFor(() => {
        expect(SubjectStaffApi.createSubjectStaff).toHaveBeenCalled();
      });

    });

    it("updates allocation", async () => {
      vi.mocked(SubjectStaffApi.getAllSubjects).mockResolvedValue({
        data: {
          subject: [{ id: 1, name: "Math" }],
        },
      } as any);

      vi.mocked(StaffApi.getAllStaff).mockResolvedValue({
        data: {
          staff: [{ id: 1, name: "John" }],
        },
      } as any);

      vi.mocked(SubjectStaffApi.getSubjectStaffById).mockResolvedValue({
        data: [
          {
            subject_id: 1,
            staff_id: 1,
          },
        ],
      } as any);

      vi.mocked(SubjectStaffApi.updateSubjectStaff).mockResolvedValue(
        {} as any,
      );

      render(
        <MemoryRouter>
          <EditSubjectStaff id={1} navigate={vi.fn()} isEditMode />
        </MemoryRouter>,
      );

      fireEvent.submit(await screen.findByRole("button"));

      
    });

    it("handles load failure", async () => {
      vi.mocked(SubjectStaffApi.getAllSubjects).mockRejectedValue(
        new Error("Failed to load"),
      );

      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <MemoryRouter>
          <EditSubjectStaff navigate={vi.fn()} isEditMode={false} />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });
    });

    it("handles submit failure", async () => {
      vi.mocked(SubjectStaffApi.getAllSubjects).mockResolvedValue({
        data: {
          subject: [{ id: 1, name: "Math" }],
        },
      } as any);

      vi.mocked(StaffApi.getAllStaff).mockResolvedValue({
        data: {
          staff: [{ id: 1, name: "John" }],
        },
      } as any);

      vi.mocked(SubjectStaffApi.createSubjectStaff).mockRejectedValue(
        new Error("Create failed"),
      );

      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <MemoryRouter>
          <EditSubjectStaff navigate={vi.fn()} isEditMode={false} />
        </MemoryRouter>,
      );

      fireEvent.submit(await screen.findByRole("button"));

      await waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });
    });

    it("does not update when id is missing", async () => {
      vi.mocked(SubjectStaffApi.getAllSubjects).mockResolvedValue({
        data: { subject: [] },
      } as any);

      vi.mocked(StaffApi.getAllStaff).mockResolvedValue({
        data: { staff: [] },
      } as any);

      render(
        <MemoryRouter>
          <EditSubjectStaff navigate={vi.fn()} isEditMode />
        </MemoryRouter>,
      );

      fireEvent.submit(await screen.findByRole("button"));

      expect(SubjectStaffApi.updateSubjectStaff).not.toHaveBeenCalled();
    });
  });
});
