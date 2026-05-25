import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import SubjectManagement from "../pages/admin/SubjectManagement.tsx";
import AddSubject from "../pages/subjects/AddSubject.tsx";
import EditSubject from "../pages/subjects/EditSubject.tsx";

jest.mock("../services/SubjectApi.ts", () => ({
  getAllSubjects: jest.fn(),
  deleteSubject: jest.fn(),
  createSubject: jest.fn(),
  getSubjectById: jest.fn(),
  updateSubject: jest.fn(),
}));

jest.mock("../services/CourseApi.ts", () => ({
  getAllCourses: jest.fn(),
}));

import {
  getAllSubjects,
  deleteSubject,
  createSubject,
  getSubjectById,
  updateSubject,
} from "../services/SubjectApi.ts";

import { getAllCourses } from "../services/CourseApi.ts";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Subject Module Test Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.alert = jest.fn();

    window.confirm = jest.fn();
  });

  describe("SubjectManagement Component", () => {
    const mockSubjects = [
      {
        id: 1,
        name: "Mathematics",
        type: "Core",
        course_id: 10,
        course_name: "BCA",
      },
    ];

    test("renders subject data", async () => {
      (getAllSubjects as jest.Mock).mockResolvedValue({
        data: mockSubjects,
      });

      render(
        <MemoryRouter>
          <SubjectManagement />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Loading subjects/i)
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(
          screen.getByText("Mathematics")
        ).toBeInTheDocument();

        expect(screen.getByText("Core")).toBeInTheDocument();

        expect(screen.getByText("BCA")).toBeInTheDocument();
      });
    });

    test("shows no subjects found message", async () => {
      (getAllSubjects as jest.Mock).mockResolvedValue({
        data: [],
      });

      render(
        <MemoryRouter>
          <SubjectManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/No subjects found/i)
        ).toBeInTheDocument();
      });
    });

    test("deletes subject successfully", async () => {
      (getAllSubjects as jest.Mock).mockResolvedValue({
        data: mockSubjects,
      });

      (deleteSubject as jest.Mock).mockResolvedValue({});

      (window.confirm as jest.Mock).mockReturnValue(true);

      render(
        <MemoryRouter>
          <SubjectManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Mathematics")
        ).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(deleteSubject).toHaveBeenCalledWith(1);

        expect(window.alert).toHaveBeenCalledWith(
          "Subject deleted successfully"
        );
      });
    });

    test("shows delete failure alert", async () => {
      (getAllSubjects as jest.Mock).mockResolvedValue({
        data: mockSubjects,
      });

      (deleteSubject as jest.Mock).mockRejectedValue(new Error("Failed"));

      (window.confirm as jest.Mock).mockReturnValue(true);

      render(
        <MemoryRouter>
          <SubjectManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Mathematics")
        ).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          "Failed to delete subject"
        );
      });
    });

    test("cancels delete when confirmation rejected", async () => {
      (getAllSubjects as jest.Mock).mockResolvedValue({
        data: mockSubjects,
      });

      (window.confirm as jest.Mock).mockReturnValue(false);

      render(
        <MemoryRouter>
          <SubjectManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Mathematics")
        ).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      expect(deleteSubject).not.toHaveBeenCalled();
    });
  });

  describe("AddSubject Component", () => {
    const mockCourses = [
      {
        id: 1,
        name: "BCA",
      },
      {
        id: 2,
        name: "MCA",
      },
    ];

    test("creates subject successfully", async () => {
      (getAllCourses as jest.Mock).mockResolvedValue({
        data: mockCourses,
      });

      (createSubject as jest.Mock).mockResolvedValue({});

      render(
        <MemoryRouter>
          <AddSubject />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("option", {
            name: "BCA",
          })
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Subject Name"),
        {
          target: {
            value: "Physics",
            name: "name",
          },
        }
      );

      const selects = screen.getAllByRole("combobox");

      fireEvent.change(selects[0], {
        target: {
          value: "Core",
          name: "type",
        },
      });

      fireEvent.change(selects[1], {
        target: {
          value: "1",
          name: "course_id",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /create subject/i,
        })
      );

      await waitFor(() => {
        expect(createSubject).toHaveBeenCalledWith({
          name: "Physics",
          type: "Core",
          course_id: 1,
        });

        expect(window.alert).toHaveBeenCalledWith(
          "Subject created successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/subject-management"
        );
      });
    });

    test("shows validation alert when course not selected", async () => {
      (getAllCourses as jest.Mock).mockResolvedValue({
        data: mockCourses,
      });

      render(
        <MemoryRouter>
          <AddSubject />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("button", {
            name: /create subject/i,
          })
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Subject Name"),
        {
          target: {
            value: "Physics",
            name: "name",
          },
        }
      );

      const selects = screen.getAllByRole("combobox");

      fireEvent.change(selects[0], {
        target: {
          value: "Core",
          name: "type",
        },
      });

      fireEvent.change(selects[1], {
        target: {
          value: "",
          name: "course_id",
        },
      });

      fireEvent.submit(
        screen.getByRole("button", {
          name: /create subject/i,
        })
      );

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          "Please select a valid course allocation."
        );
      });
    });
  });

  describe("EditSubject Component", () => {
    const mockSubject = [
      {
        id: 1,
        name: "Mathematics",
        type: "Core",
        course_id: 10,
      },
    ];

    test("loads subject and updates successfully", async () => {
      (getSubjectById as jest.Mock).mockResolvedValue({
        data: mockSubject,
      });

      (updateSubject as jest.Mock).mockResolvedValue({});

      render(
        <MemoryRouter initialEntries={["/subject/edit/1"]}>
          <Routes>
            <Route
              path="/subject/edit/:id"
              element={<EditSubject />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("Mathematics")
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Subject Name"),
        {
          target: {
            value: "Physics",
            name: "name",
          },
        }
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /update subject/i,
        })
      );

      await waitFor(() => {
        expect(updateSubject).toHaveBeenCalledWith(1, {
          id: 1,
          name: "Physics",
          type: "Core",
          course_id: 10,
        });

        expect(window.alert).toHaveBeenCalledWith(
          "Subject updated successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/subject/management"
        );
      });
    });

    test("shows update failure alert", async () => {
      (getSubjectById as jest.Mock).mockResolvedValue({
        data: mockSubject,
      });

      (updateSubject as jest.Mock).mockRejectedValue(
        new Error("Failed")
      );

      render(
        <MemoryRouter initialEntries={["/subject/edit/1"]}>
          <Routes>
            <Route
              path="/subject/edit/:id"
              element={<EditSubject />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("Mathematics")
        ).toBeInTheDocument();
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /update subject/i,
        })
      );

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          "Failed to update subject"
        );
      });
    });
  });
});