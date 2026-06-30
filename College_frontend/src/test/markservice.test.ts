import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../interceptor.ts";

import {
  createMark,
  getMarks,
  deleteMarks,
  getMarkbylogin,
  getMarkbyId,
  updateMark,
  getAllSubjects,
  getAllStudents,
  getAllExams,
  downloadStudentReport,
} from "../services/MarkApi.ts";

vi.mock("../interceptor", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("MarkApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createMark", () => {
    it("should create a mark", async () => {
      const payload = {
        student_id: 1,
        subject_id: 2,
        exam_id: 3,
        mark: 95,
      };

      (api.post as any).mockResolvedValue({ data: payload });

      await createMark(payload as any);

      expect(api.post).toHaveBeenCalledWith(
        "/mark/add-mark",
        payload
      );
    });
  });

  describe("getMarks", () => {
    it("should fetch marks with semester", async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      await getMarks(1, 10, "John", 2);

      expect(api.get).toHaveBeenCalledWith(
        "/mark/get-marks?page=1&limit=10&search=John&semester=2"
      );
    });

    it("should fetch marks without semester", async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      await getMarks(2, 5, "");

      expect(api.get).toHaveBeenCalledWith(
        "/mark/get-marks?page=2&limit=5&search=&semester=undefined"
      );
    });
  });

  describe("deleteMarks", () => {
    it("should delete a mark", async () => {
      (api.delete as any).mockResolvedValue({ data: {} });

      await deleteMarks(5);

      expect(api.delete).toHaveBeenCalledWith(
        "/mark/delete-mark/5"
      );
    });
  });

  describe("getMarkbylogin", () => {
    it("should fetch marks by login", async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      await getMarkbylogin(4);

      expect(api.get).toHaveBeenCalledWith(
        "/mark/get-mark-login?semester=4"
      );
    });
  });

  describe("getMarkbyId", () => {
    it("should fetch mark by id", async () => {
      (api.get as any).mockResolvedValue({ data: {} });

      await getMarkbyId(8);

      expect(api.get).toHaveBeenCalledWith(
        "/mark/get-marksby/8"
      );
    });
  });

  describe("updateMark", () => {
    it("should update a mark", async () => {
      const payload = {
        student_id: 1,
        subject_id: 2,
        exam_id: 3,
        mark: 88,
      };

      (api.put as any).mockResolvedValue({ data: payload });

      await updateMark(7, payload as any);

      expect(api.put).toHaveBeenCalledWith(
        "/mark/edit-mark/7",
        payload
      );
    });
  });

  describe("getAllSubjects", () => {
    it("should fetch all allocated subjects", async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      await getAllSubjects();

      expect(api.get).toHaveBeenCalledWith(
        "/subject/get-subject-staff-allo"
      );
    });
  });

  describe("getAllStudents", () => {
    it("should fetch all students", async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      await getAllStudents();

      expect(api.get).toHaveBeenCalledWith(
        "/student/get-students"
      );
    });
  });

  describe("getAllExams", () => {
    it("should fetch all exams", async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      await getAllExams();

      expect(api.get).toHaveBeenCalledWith(
        "/exam/get-exam"
      );
    });
  });

  describe("downloadStudentReport", () => {
    it("should download student report as blob", async () => {
      (api.get as any).mockResolvedValue({ data: new Blob() });

      await downloadStudentReport(10);

      expect(api.get).toHaveBeenCalledWith(
        "/student-report/get-student-report/10",
        {
          responseType: "blob",
        }
      );
    });
  });
});