import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../interceptor.ts";

import {
  getstaffProfile,
  registerStaff,
  getAllStaff,
  getStaffById,
  deleteStaff,
  updateProfile,
  updateStaff,
} from "../services/StaffApi.ts";

vi.mock("../interceptor", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("StaffApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getstaffProfile", () => {
    it("should fetch staff profile", async () => {
      (api.get as any).mockResolvedValue({
        data: {},
      });

      await getstaffProfile();

      expect(api.get).toHaveBeenCalledWith(
        "/staff/staffprofile"
      );
    });
  });

  describe("registerStaff", () => {
    it("should register a staff member", async () => {
      const payload = {
        name: "John",
        email: "john@test.com",
      };

      (api.post as any).mockResolvedValue({
        data: payload,
      });

      await registerStaff(payload as any);

      expect(api.post).toHaveBeenCalledWith(
        "/staff/add-staff",
        payload
      );
    });
  });

  describe("getAllStaff", () => {
    it("should fetch all staff with pagination and search", async () => {
      (api.get as any).mockResolvedValue({
        data: [],
      });

      await getAllStaff(10, 2, "John");

      expect(api.get).toHaveBeenCalledWith(
        "/staff/get-staffs?page=2&limit=10&search=John"
      );
    });

    it("should use empty search by default", async () => {
      (api.get as any).mockResolvedValue({
        data: [],
      });

      await getAllStaff(5, 1);

      expect(api.get).toHaveBeenCalledWith(
        "/staff/get-staffs?page=1&limit=5&search="
      );
    });
  });

  describe("getStaffById", () => {
    it("should fetch a staff member by id", async () => {
      (api.get as any).mockResolvedValue({
        data: {},
      });

      await getStaffById(5);

      expect(api.get).toHaveBeenCalledWith(
        "/staff/get-staff/5"
      );
    });
  });

  describe("deleteStaff", () => {
    it("should delete a staff member", async () => {
      (api.delete as any).mockResolvedValue({
        data: {},
      });

      await deleteStaff(8);

      expect(api.delete).toHaveBeenCalledWith(
        "/staff/delete-staff/8"
      );
    });
  });

  describe("updateProfile", () => {
    it("should update staff profile", async () => {
      const payload = {
        name: "Updated User",
      };

      (api.put as any).mockResolvedValue({
        data: payload,
      });

      await updateProfile(payload as any);

      expect(api.put).toHaveBeenCalledWith(
        "/staff/edit-profile",
        payload
      );
    });
  });

  describe("updateStaff", () => {
    it("should update a staff member", async () => {
      const payload = {
        name: "Updated Staff",
      };

      (api.put as any).mockResolvedValue({
        data: payload,
      });

      await updateStaff(3, payload as any);

      expect(api.put).toHaveBeenCalledWith(
        "/staff/edit-staff/3",
        payload
      );
    });
  });
});