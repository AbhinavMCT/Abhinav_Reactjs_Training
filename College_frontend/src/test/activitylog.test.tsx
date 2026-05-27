import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AxiosResponse, AxiosHeaders } from "axios";
import ViewActivityLog from "../pages/admin/ActivityLog.tsx";
import { getActivityLog } from "../services/ActivitylogApi.ts";

// Correct mock path
vi.mock("../services/ActivitylogApi.ts", () => ({
  getActivityLog: vi.fn(),
}));

describe("ViewActivityLog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table heading", async () => {
    const mockResponse: AxiosResponse = {
      data: [],
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    };

    vi.mocked(getActivityLog).mockResolvedValue(mockResponse);

    render(<ViewActivityLog />);

    expect(screen.getByText("Staff Management")).toBeInTheDocument();
  });

  it("fetches and displays activity log data", async () => {
    const mockData = [
      {
        id: 1,
        role: "Admin",
        action: "Created Student",
        table_name: "Student",
      },
      {
        id: 2,
        role: "Staff",
        action: "Updated Exam",
        table_name: "Exam",
      },
    ];

    const mockResponse: AxiosResponse = {
      data: mockData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    };

    vi.mocked(getActivityLog).mockResolvedValue(mockResponse);

    render(<ViewActivityLog />);

    await waitFor(() => {
      expect(screen.getByText("Admin")).toBeInTheDocument();
      expect(screen.getByText("Created Student")).toBeInTheDocument();
      expect(screen.getByText("Student")).toBeInTheDocument();

      expect(screen.getByText("Staff")).toBeInTheDocument();
      expect(screen.getByText("Updated Exam")).toBeInTheDocument();
      expect(screen.getByText("Exam")).toBeInTheDocument();
    });
  });

  it("calls getActivityLog API once", async () => {
    const mockResponse: AxiosResponse = {
      data: [],
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    };

    vi.mocked(getActivityLog).mockResolvedValue(mockResponse);

    render(<ViewActivityLog />);

    await waitFor(() => {
      expect(getActivityLog).toHaveBeenCalledTimes(1);
    });
  });

  it("handles API error gracefully", async () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.mocked(getActivityLog).mockRejectedValue(
      new Error("API Error")
    );

    render(<ViewActivityLog />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});