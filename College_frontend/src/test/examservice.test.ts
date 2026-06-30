import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../interceptor.ts";

import {
  getAllExams,
  getExamById,
  getExamstudents,
  createExam,
  updateExam,
  deleteExam,
  getallCourse,
} from "../services/ExamApi.ts";

vi.mock("../interceptor", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("ExamApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllExams", () => {
    it("should fetch exams with pagination and search", async () => {
      (api.get as any).mockResolvedValue({
        data: [],
      });

      await getAllExams(10, 1, "Semester 1");

      expect(api.get).toHaveBeenCalledWith(
        "/exam/get-exam?limit=10&page=1&search=Semester 1"
      );
    });
  });

  describe("getExamById", () => {
    it("should fetch exam by id", async () => {
      (api.get as any).mockResolvedValue({
        data: {},
      });

      await getExamById(5);

      expect(api.get).toHaveBeenCalledWith(
        "/exam/get-exambyid/5"
      );
    });
  });

  describe("getExamstudents", () => {
    it("should fetch exam students", async () => {
      (api.get as any).mockResolvedValue({
        data: [],
      });

      await getExamstudents("John");

      expect(api.get).toHaveBeenCalledWith(
        "/exam/get-exam-students?search=John"
      );
    });
  });

  describe("createExam", () => {
    it("should create an exam", async () => {
      const payload = {
        name: "Mid Term",
        semester: 2,
      };

      (api.post as any).mockResolvedValue({
        data: payload,
      });

      await createExam(payload as any);

      expect(api.post).toHaveBeenCalledWith(
        "/exam/add-exam",
        payload
      );
    });
  });

  describe("updateExam", () => {
    it("should update an exam", async () => {
      const payload = {
        name: "Final Exam",
        semester: 4,
      };

      (api.put as any).mockResolvedValue({
        data: payload,
      });

      await updateExam(3, payload as any);

      expect(api.put).toHaveBeenCalledWith(
        "/exam/edit-exam/3",
        payload
      );
    });
  });

  describe("deleteExam", () => {
    it("should delete an exam", async () => {
      (api.delete as any).mockResolvedValue({
        data: {},
      });

      await deleteExam(8);

      expect(api.delete).toHaveBeenCalledWith(
        "/exam/delete-exam/8"
      );
    });
  });

  describe("getallCourse", () => {
    it("should fetch all courses", async () => {
      (api.get as any).mockResolvedValue({
        data: [],
      });

      await getallCourse();

      expect(api.get).toHaveBeenCalledWith(
        "/course/get-course"
      );
    });
  });
});