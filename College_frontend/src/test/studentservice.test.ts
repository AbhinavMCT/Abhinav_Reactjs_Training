import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../interceptor.ts";

import {
  getProfile,
  getStudents,
  registerStudent,
  getAllStudents,
  getStudentById,
  deleteStudent,
  updateProfile,
  updateStudents,
  importStudents,
} from "../services/StudentApi.ts";

vi.mock("../interceptor", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("StudentApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should call profile endpoint", async () => {
      (api.get as any).mockResolvedValue({ data: {} });

      await getProfile();

      expect(api.get).toHaveBeenCalledWith("/student/profile");
    });
  });

  describe("getStudents", () => {
    it("should fetch students with pagination", async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      await getStudents(1, 10);

      expect(api.get).toHaveBeenCalledWith(
        "/student/students?page=1&limit=10"
      );
    });
  });

  describe("registerStudent", () => {
    it("should register a student", async () => {
      const payload = {
        name: "John",
        email: "john@test.com",
      };

      (api.post as any).mockResolvedValue({
        data: payload,
      });

      await registerStudent(payload as any);

      expect(api.post).toHaveBeenCalledWith(
        "/student/add-student",
        payload
      );
    });
  });

  describe("getAllStudents", () => {
    it("should fetch students with pagination and search", async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      await getAllStudents(2, 5, "john");

      expect(api.get).toHaveBeenCalledWith(
        "/student/get-students?page=2&limit=5&search=john"
      );
    });
  });

  describe("getStudentById", () => {
    it("should fetch student by id", async () => {
      (api.get as any).mockResolvedValue({ data: {} });

      await getStudentById(5);

      expect(api.get).toHaveBeenCalledWith(
        "/student/get-student/5"
      );
    });
  });

  describe("deleteStudent", () => {
    it("should delete student", async () => {
      (api.delete as any).mockResolvedValue({ data: {} });

      const consoleSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});

      await deleteStudent(7);

      expect(consoleSpy).toHaveBeenCalledWith(
        "/student//delete-student/7"
      );

      expect(api.delete).toHaveBeenCalledWith(
        "/student/delete-student/7"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("updateProfile", () => {
    it("should update profile", async () => {
      const payload = {
        name: "Updated User",
      };

      (api.put as any).mockResolvedValue({
        data: payload,
      });

      await updateProfile(payload as any);

      expect(api.put).toHaveBeenCalledWith(
        "/student/edit-profile",
        payload
      );
    });
  });

  describe("updateStudents", () => {
    it("should update student", async () => {
      const payload = {
        name: "Updated Student",
      };

      (api.put as any).mockResolvedValue({
        data: payload,
      });

      await updateStudents(3, payload as any);

      expect(api.put).toHaveBeenCalledWith(
        "/student/edit-student/3",
        payload
      );
    });
  });

  describe("importStudents", () => {
    it("should upload excel file", async () => {
      (api.post as any).mockResolvedValue({
        data: {},
      });

      const file = new File(
        ["dummy content"],
        "students.xlsx",
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      await importStudents(file);

      expect(api.post).toHaveBeenCalledTimes(1);

      const [url, formData, config] = (api.post as any).mock.calls[0];

      expect(url).toBe("/import-students");
      expect(formData).toBeInstanceOf(FormData);
      expect(config).toEqual({
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });
  });
});