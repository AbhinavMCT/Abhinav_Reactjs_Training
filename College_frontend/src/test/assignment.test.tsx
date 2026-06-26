import {render,screen,fireEvent,waitFor,within,} from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AssignmentView from "../pages/assignment/AssignmentView.tsx";
import * as AssignmentApi from "../services/AssignmentApi.ts";

vi.mock("../services/AssignmentApi", () => ({
  getAllAssignments: vi.fn(),
  deleteAssignment: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Assignment Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays assignments on mount", async () => {
    const mockAssignments = {
      data: {
        assignments: [
          {
            id: 1,
            assignment_name: "React Basics",
            description: "Study React hooks",
            status: "NOT SUBMITTED",
          },
        ],
        totalPages: 1,
        totalRecords: 1,
      },
    };

    vi.mocked(AssignmentApi.getAllAssignments).mockResolvedValue(
      mockAssignments as any,
    );

    render(
      <MemoryRouter>
        <AssignmentView />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading Assignments.../i)).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText("React Basics")).toBeDefined();
    });

    expect(AssignmentApi.getAllAssignments).toHaveBeenCalled();
  });

  it("deletes an assignment successfully", async () => {
    const mockAssignments = {
      data: {
        assignments: [
          {
            id: 1,
            assignment_name: "To be deleted",
            description: "Description here",
            status: "NOT SUBMITTED",
          },
        ],
        totalPages: 1,
        totalRecords: 1,
      },
    };

    vi.mocked(AssignmentApi.getAllAssignments).mockResolvedValue(mockAssignments as any);
    vi.mocked(AssignmentApi.deleteAssignment).mockResolvedValue({} as any);

    render(
      <MemoryRouter>
        <AssignmentView />
      </MemoryRouter>,
    );

    const assignmentText = await screen.findByText(/To be deleted/i);
    
    const row = assignmentText.closest("tr");
    if (!row) {
      throw new Error("Could not find table row for 'To be deleted'");
    }

    const deleteBtn = within(row).getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    const confirmBtn = await screen.findByRole("button", { name: /confirm/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(AssignmentApi.deleteAssignment).toHaveBeenCalledWith(1);
    });
  });
});