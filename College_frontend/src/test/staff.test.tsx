import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";

import StaffManagement from "../pages/admin/StaffManagement.tsx";
import ViewStaff from "../pages/staff/ViewStaffProfile.tsx";

vi.mock("../services/StaffApi.ts", () => ({
  getAllStaff: vi.fn(),
  deleteStaff: vi.fn(),
  getProfile: vi.fn(),
}));

import {
  getAllStaff,
  deleteStaff,
  getProfile,
} from "../services/StaffApi.ts";

describe("Staff Module Test Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.alert = vi.fn();
    globalThis.confirm = vi.fn();
  });

  describe("StaffManagement Component", () => {
    const mockStaff = [
      {
        userData: {
          id: 1,
          name: "John",
          email: "john@gmail.com",
          contact: "9999999999",
          gender: "male",
          DOB: "1999-01-01",
        },

        addressData: {
          city: "Kochi",
          district: "Ernakulam",
          state: "Kerala",
          pin: 682001,
        },
      },
    ];

    test("renders staff data", async () => {
      vi.mocked(getAllStaff).mockResolvedValue({
        data: mockStaff,
      } as never);

      render(
        <MemoryRouter>
          <StaffManagement />
        </MemoryRouter>
      );

      expect(
        await screen.findByText("John")
      ).toBeInTheDocument();

      expect(
        screen.getByText("john@gmail.com")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Kochi")
      ).toBeInTheDocument();
    });

    test("deletes staff successfully", async () => {
      vi.mocked(getAllStaff).mockResolvedValue({
        data: mockStaff,
      } as never);

      vi.mocked(deleteStaff).mockResolvedValue(
        {} as never
      );

      vi.mocked(globalThis.confirm).mockReturnValue(true);

      render(
        <MemoryRouter>
          <StaffManagement />
        </MemoryRouter>
      );

      expect(
        await screen.findByText("John")
      ).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", {
          name: /delete/i,
        })
      );

      await waitFor(() => {
        expect(deleteStaff).toHaveBeenCalledWith(1);
      });
    });
  });

  describe("ViewStaff Component", () => {
    const mockProfile = {
      name: "John",
      email: "john@gmail.com",
      contact: "9999999999",
      gender: "male",
      DOB: "1999-01-01",

      address: {
        city: "Kochi",
        district: "Ernakulam",
        state: "Kerala",
        pin: 682001,
      },
    };

    test("renders profile data", async () => {
      vi.mocked(getProfile).mockResolvedValue({
        data: mockProfile,
      } as never);

      render(
        <MemoryRouter>
          <ViewStaff />
        </MemoryRouter>
      );

      expect(
        await screen.findByText("John")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Kochi")
      ).toBeInTheDocument();
    });
  });
});