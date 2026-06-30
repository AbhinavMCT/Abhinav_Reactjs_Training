import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import api from "../interceptor.ts";

import {
  getAllcoursesview,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  allocatedcourse,
  getAllDepartments,
} from "../services/CourseApi.ts";

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock interceptor
vi.mock("../interceptor", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("CourseApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllcoursesview", () => {
    it("should call axios.get with correct endpoint", async () => {
      (axios.get as any).mockResolvedValue({
        data: [{ id: 1, name: "MCA" }],
      });

      const result = await getAllcoursesview();

      expect(axios.get).toHaveBeenCalledWith("/course/view-course");
      expect(result.data).toEqual([{ id: 1, name: "MCA" }]);
    });
  });

  describe("getAllCourses", () => {
    it("should call api.get with pagination and search", async () => {
      (api.get as any).mockResolvedValue({
        data: [],
      });

      await getAllCourses(10, 2, "MCA");

      expect(api.get).toHaveBeenCalledWith(
        "/course/get-course?limit=10&page=2&search=MCA"
      );
    });
  });

  describe("getCourseById", () => {
    it("should call api.get with course id", async () => {
      (api.get as any).mockResolvedValue({
        data: { id: 1 },
      });

      await getCourseById(1);

      expect(api.get).toHaveBeenCalledWith(
        "/course/get-courseby/1"
      );
    });
  });

  describe("createCourse", () => {
    it("should call api.post with payload", async () => {
      const payload = {
        name: "BCA",
        dep_id: 2,
      };

      (api.post as any).mockResolvedValue({
        data: payload,
      });

      await createCourse(payload);

      expect(api.post).toHaveBeenCalledWith(
        "/course/add-course",
        payload
      );
    });
  });

  describe("updateCourse", () => {
    it("should call api.put with id and payload", async () => {
      const payload = {
        name: "MCA Updated",
        dep_id: 3,
      };

      (api.put as any).mockResolvedValue({
        data: payload,
      });

      await updateCourse(5, payload);

      expect(api.put).toHaveBeenCalledWith(
        "/course/edit-course/5",
        payload
      );
    });
  });

  describe("deleteCourse", () => {
    it("should call api.delete with course id", async () => {
      (api.delete as any).mockResolvedValue({
        data: {},
      });

      await deleteCourse(4);

      expect(api.delete).toHaveBeenCalledWith(
        "/course/delete-course/4"
      );
    });
  });

  describe("allocatedcourse", () => {
    it("should call api.get", async () => {
      (api.get as any).mockResolvedValue({
        data: [],
      });

      await allocatedcourse();

      expect(api.get).toHaveBeenCalledWith(
        "/course/get-allocatedcourse"
      );
    });
  });

  describe("getAllDepartments", () => {
    it("should call api.get with departments endpoint", async () => {
      (api.get as any).mockResolvedValue({
        data: [],
      });

      await getAllDepartments();

      expect(api.get).toHaveBeenCalledWith(
        "/department/get-departments"
      );
    });
  });
});