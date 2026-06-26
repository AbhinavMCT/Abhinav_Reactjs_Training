import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ViewActivityLog from "../pages/admin/ActivityLog.tsx";
import * as ActivityLogApi from "../services/ActivitylogApi.ts";

// 1. Mock the API
vi.mock("../services/ActivitylogApi.ts", () => ({
  getActivityLog: vi.fn(),
}));

describe("ViewActivityLog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays activity logs on mount", async () => {
    const mockData = {
      data: [
        {
          id: 1,
          role: "Admin",
          action: "DELETE",
          table_name: "Student",
        },
      ],
    };

    vi.mocked(ActivityLogApi.getActivityLog).mockResolvedValue(mockData as any);

    render(
      <MemoryRouter>
        <ViewActivityLog />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Admin")).toBeDefined();
      expect(screen.getByText("DELETE")).toBeDefined();
      expect(screen.getByText("Student")).toBeDefined();
    });

    expect(ActivityLogApi.getActivityLog).toHaveBeenCalledTimes(1);
  });

  it("displays empty table when no logs are returned", async () => {
    vi.mocked(ActivityLogApi.getActivityLog).mockResolvedValue({ data: [] } as any);

    render(
      <MemoryRouter>
        <ViewActivityLog />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(ActivityLogApi.getActivityLog).toHaveBeenCalled();
    });
    
    const rows = screen.queryByRole("row", { name: /admin/i });
    expect(rows).toBeNull();
  });
});