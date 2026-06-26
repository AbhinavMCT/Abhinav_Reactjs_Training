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
import MarkAttendance from "../pages/attendence/MarkAttendence.tsx";
import Viewattendence from "../pages/attendence/Viewattendence.tsx";
import * as AttendanceApi from "../services/AttendenceApi.ts";

vi.mock("../services/AttendenceApi");

vi.mocked(AttendanceApi.updatemarkedAttendence).mockResolvedValue({} as any);

fireEvent.click(screen.getByRole("button", {
    name:/save/i
}));

await waitFor(() => {
  expect(AttendanceApi.updatemarkedAttendence).toHaveBeenCalled();
});

describe("Attendance Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("MarkAttendance", () => {
    it("fetches courses and students on mount", async () => {
      vi.mocked(AttendanceApi.getAllCourse).mockResolvedValue({
        data: [{ id: 1, name: "CS101" }],
      } as any);
      vi.mocked(AttendanceApi.getStudentsByCourse).mockResolvedValue({
        data: [{ id: 10, name: "John Doe" }],
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <MarkAttendance />
          </MemoryRouter>,
        );
      });

      expect(AttendanceApi.getAllCourse).toHaveBeenCalled();
      expect(
        await screen.findByText((content, element) => {
          return (
            element?.tagName.toLowerCase() === "td" &&
            content.includes("John Doe")
          );
        }),
      ).toBeDefined();
    });

    it("submits attendance successfully", async () => {
      vi.mocked(AttendanceApi.getAllCourse).mockResolvedValue({
        data: [{ id: 1, name: "CS101" }],
      } as any);
      vi.mocked(AttendanceApi.getStudentsByCourse).mockResolvedValue({
        data: [{ id: 10, name: "John Doe" }],
      } as any);
      vi.mocked(AttendanceApi.markAttendance).mockResolvedValue({} as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <MarkAttendance />
          </MemoryRouter>,
        );
      });

      const dateInput = await screen.findByTestId("attendance-date-input");

      fireEvent.change(dateInput, { target: { value: "2026-06-26" } });

      await act(async () => {
        fireEvent.click(screen.getByText(/Submit Attendance/i));
      });

      expect(AttendanceApi.markAttendance).toHaveBeenCalled();
    });
  });

  describe("Viewattendence", () => {
    it("displays filtered attendance data", async () => {
      vi.mocked(AttendanceApi.getallattenndence).mockResolvedValue({
        data: {
          attendence: [{ name: "John Doe", status: "present" }],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);
      vi.mocked(AttendanceApi.getAllCourse).mockResolvedValue({
        data: [],
      } as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <Viewattendence />
          </MemoryRouter>,
        );
      });

      expect(await screen.findByText("John Doe")).toBeDefined();
    });

    it("loads courses on mount", async () => {
      vi.mocked(AttendanceApi.getallattenndence).mockResolvedValue({
        data: {
          attendence: [],
          totalPages: 1,
          totalRecords: 0,
        },
      } as any);

      vi.mocked(AttendanceApi.getAllCourse).mockResolvedValue({
        data: [
          { id: 1, name: "BCA" },
          { id: 2, name: "MCA" },
        ],
      } as any);

      render(
        <MemoryRouter>
          <Viewattendence />
        </MemoryRouter>,
      );

      expect(await screen.findByText("BCA")).toBeInTheDocument();
    });

    it("handles attendance fetch failure", async () => {
      vi.mocked(AttendanceApi.getallattenndence).mockRejectedValue(
        new Error("API Error"),
      );

      vi.mocked(AttendanceApi.getAllCourse).mockResolvedValue({
        data: [],
      } as any);

      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <MemoryRouter>
          <Viewattendence />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(spy).toHaveBeenCalled();
      });
    });

    it("handles course loading failure", async () => {
      vi.mocked(AttendanceApi.getallattenndence).mockResolvedValue({
        data: {
          attendence: [],
          totalPages: 1,
          totalRecords: 0,
        },
      } as any);

      vi.mocked(AttendanceApi.getAllCourse).mockRejectedValue(
        new Error("Course Error"),
      );

      render(
        <MemoryRouter>
          <Viewattendence />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(AttendanceApi.getAllCourse).toHaveBeenCalled();
      });
    });

    it("opens edit modal", async () => {
      vi.mocked(AttendanceApi.getallattenndence).mockResolvedValue({
        data: {
          attendence: [
            {
              id: 1,
              name: "John",
              semester: 1,
              status: "present",
              attendance_date: "2026-06-26",
              course_id: 1,
            },
          ],
          totalPages: 1,
          totalRecords: 1,
        },
      } as any);

      vi.mocked(AttendanceApi.getAllCourse).mockResolvedValue({
        data: [],
      } as any);

      render(
        <MemoryRouter>
          <Viewattendence />
        </MemoryRouter>,
      );

      fireEvent.click(await screen.findByText("Edit"));

      expect(screen.getByText("Edit Attendance")).toBeInTheDocument();
    });
  });
});
