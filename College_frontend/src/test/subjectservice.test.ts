import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../interceptor.ts";

import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getAllCourses,
} from "../services/SubjectApi.ts";

vi.mock("../interceptor", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("SubjectApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllSubjects", () => {
    it("should fetch all subjects with pagination and search", async () => {
      (api.get as any).mockResolvedValue({
        data: [],
      });

      await getAllSubjects(10, 1, "Math");

      expect(api.get).toHaveBeenCalledWith(
        "/subject/get-subjects?limit=10&page=1&search=Math"
      );
    });
  });

  describe("getSubjectById", () => {
    it("should fetch subject by id", async () => {
      (api.get as any).mockResolvedValue({
        data: {},
      });

      await getSubjectById(5);

      expect(api.get).toHaveBeenCalledWith(
        "/subject/get-subjectby/5"
      );
    });
  });

  describe("createSubject", () => {
    it("should create a subject", async () => {
      const payload = {
        name: "Physics",
        course_id: 1,
      };

      (api.post as any).mockResolvedValue({
        data: payload,
      });

      await createSubject(payload as any);

      expect(api.post).toHaveBeenCalledWith(
        "/subject/add-subject",
        payload
      );
    });
  });

  describe("updateSubject", () => {
    it("should update a subject", async () => {
      const payload = {
        name: "Advanced Physics",
        course_id: 2,
      };

      (api.put as any).mockResolvedValue({
        data: payload,
      });

      await updateSubject(3, payload as any);

      expect(api.put).toHaveBeenCalledWith(
        "/subject/edit-subject/3",
        payload
      );
    });
  });

  describe("deleteSubject", () => {
    it("should delete a subject", async () => {
      (api.delete as any).mockResolvedValue({
        data: {},
      });

      await deleteSubject(4);

      expect(api.delete).toHaveBeenCalledWith(
        "/subject/delete-subject/4"
      );
    });
  });

  describe("getAllCourses", () => {
    it("should fetch all courses", async () => {
      (api.get as any).mockResolvedValue({
        data: [],
      });

      await getAllCourses();

      expect(api.get).toHaveBeenCalledWith(
        "/course/get-course"
      );
    });
  });
});