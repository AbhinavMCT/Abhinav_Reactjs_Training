import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../interceptor.ts";

import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/DepartmentApi.ts";

vi.mock("../interceptor", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("DepartmentApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDepartments", () => {
    it("should fetch departments with pagination and search", async () => {
      const departments = [
        { id: 1, name: "Computer Science" },
      ];

      (api.get as any).mockResolvedValue({
        data: departments,
      });

      const result = await getDepartments(10, 1, "Computer");

      expect(api.get).toHaveBeenCalledWith(
        "/department/get-departments?limit=10&page=1&search=Computer"
      );

      expect(result).toEqual(departments);
    });
  });

  describe("getDepartmentById", () => {
    it("should fetch department by id", async () => {
      const department = {
        id: 5,
        name: "Electronics",
      };

      (api.get as any).mockResolvedValue({
        data: department,
      });

      const result = await getDepartmentById(5);

      expect(api.get).toHaveBeenCalledWith(
        "/department/get-departmentsby/5"
      );

      expect(result).toEqual(department);
    });
  });

  describe("createDepartment", () => {
    it("should create a department", async () => {
      const payload = {
        name: "Mechanical",
      };

      (api.post as any).mockResolvedValue({
        data: payload,
      });

      const result = await createDepartment(payload as any);

      expect(api.post).toHaveBeenCalledWith(
        "/department/add-department",
        payload
      );

      expect(result).toEqual(payload);
    });
  });

  describe("updateDepartment", () => {
    it("should update a department", async () => {
      const payload = {
        name: "Civil Engineering",
      };

      (api.put as any).mockResolvedValue({
        data: payload,
      });

      const result = await updateDepartment(3, payload as any);

      expect(api.put).toHaveBeenCalledWith(
        "/department/edit-department/3",
        payload
      );

      expect(result).toEqual(payload);
    });
  });

  describe("deleteDepartment", () => {
    it("should delete a department", async () => {
      const response = {
        success: true,
        message: "Department deleted successfully",
      };

      (api.delete as any).mockResolvedValue({
        data: response,
      });

      const result = await deleteDepartment(8);

      expect(api.delete).toHaveBeenCalledWith(
        "/department/delete-department/8"
      );

      expect(result).toEqual(response);
    });
  });
});