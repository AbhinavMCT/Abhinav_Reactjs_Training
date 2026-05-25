import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import CourseManagement from "../pages/admin/CourseManagement.tsx";
import AddCourse from "../pages/course/AddCourse.tsx";
import EditCourse from "../pages/course/EditCourse.tsx";

jest.mock("../services/CourseApi.ts", () => ({
  getAllCourses: jest.fn(),
  deleteCourse: jest.fn(),
  createCourse: jest.fn(),
  getCourseById: jest.fn(),
  updateCourse: jest.fn(),
  getAllDepartments: jest.fn(),
}));

import {
  getAllCourses,
  deleteCourse,
  createCourse,
  getCourseById,
  updateCourse,
  getAllDepartments,
} from "../services/CourseApi.ts";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Course Module Test Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.alert = jest.fn();

    window.confirm = jest.fn();
  });



  describe("CourseManagement Component", () => {
    const mockCourses = [
      {
        id: 1,
        name: "BCA",
        dep_id: 10,
        department_name: "Computer Science",
      },
    ];

    test("renders course data", async () => {
      (getAllCourses as jest.Mock).mockResolvedValue({
        data: mockCourses,
      });

      render(
        <MemoryRouter>
          <CourseManagement />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Loading courses/i)
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("BCA")).toBeInTheDocument();

        expect(
          screen.getByText("Computer Science")
        ).toBeInTheDocument();
      });
    });

    test("shows no courses found message", async () => {
      (getAllCourses as jest.Mock).mockResolvedValue({
        data: [],
      });

      render(
        <MemoryRouter>
          <CourseManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/No courses found/i)
        ).toBeInTheDocument();
      });
    });

    test("deletes course successfully", async () => {
      (getAllCourses as jest.Mock).mockResolvedValue({
        data: mockCourses,
      });

      (deleteCourse as jest.Mock).mockResolvedValue({});

      (window.confirm as jest.Mock).mockReturnValue(true);

      render(
        <MemoryRouter>
          <CourseManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("BCA")).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(deleteCourse).toHaveBeenCalledWith(1);

        expect(window.alert).toHaveBeenCalledWith(
          "Course deleted successfully"
        );
      });
    });

    test("shows delete failure alert", async () => {
      (getAllCourses as jest.Mock).mockResolvedValue({
        data: mockCourses,
      });

      (deleteCourse as jest.Mock).mockRejectedValue({});

      (window.confirm as jest.Mock).mockReturnValue(true);

      render(
        <MemoryRouter>
          <CourseManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("BCA")).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          "Failed to delete course"
        );
      });
    });

    test("cancels delete when confirmation rejected", async () => {
      (getAllCourses as jest.Mock).mockResolvedValue({
        data: mockCourses,
      });

      (window.confirm as jest.Mock).mockReturnValue(false);

      render(
        <MemoryRouter>
          <CourseManagement />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText("BCA")).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole("button", {
        name: /delete/i,
      });

      fireEvent.click(deleteButton);

      expect(deleteCourse).not.toHaveBeenCalled();
    });
  });



  describe("AddCourse Component", () => {
    const mockDepartments = [
      {
        id: 1,
        name: "Computer Science",
      },
      {
        id: 2,
        name: "Commerce",
      },
    ];

    test("creates course successfully", async () => {
      (getAllDepartments as jest.Mock).mockResolvedValue({
        data: mockDepartments,
      });

      (createCourse as jest.Mock).mockResolvedValue({});

      render(
        <MemoryRouter>
          <AddCourse />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByRole("option", {
            name: "Computer Science",
          })
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Course Name"),
        {
          target: {
            value: "MCA",
            name: "name",
          },
        }
      );

      const selectInput = document.querySelector(
        'select[name="dep_id"]'
      ) as HTMLSelectElement;

      fireEvent.change(selectInput, {
        target: {
          value: "1",
          name: "dep_id",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /create course/i,
        })
      );

      await waitFor(() => {
        expect(createCourse).toHaveBeenCalledWith({
          name: "MCA",
          dep_id: 1,
        });

        expect(window.alert).toHaveBeenCalledWith(
          "Course created successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/course/management"
        );
      });
    });

    test("shows create failure alert", async () => {
      (getAllDepartments as jest.Mock).mockResolvedValue({
        data: mockDepartments,
      });

      (createCourse as jest.Mock).mockRejectedValue({});

      render(
        <MemoryRouter>
          <AddCourse />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("Course Name")
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Course Name"),
        {
          target: {
            value: "MBA",
            name: "name",
          },
        }
      );

      const selectInput = document.querySelector(
        'select[name="dep_id"]'
      ) as HTMLSelectElement;

      fireEvent.change(selectInput, {
        target: {
          value: "1",
          name: "dep_id",
        },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /create course/i,
        })
      );

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          "Failed to create course"
        );
      });
    });
  });


  describe("EditCourse Component", () => {
    const mockDepartments = [
      {
        id: 1,
        name: "Computer Science",
      },
      {
        id: 2,
        name: "Commerce",
      },
    ];

    const mockCourse = [
      {
        id: 1,
        name: "BCA",
        dep_id: 1,
      },
    ];

    test("loads course and updates successfully", async () => {
      (getCourseById as jest.Mock).mockResolvedValue({
        data: mockCourse,
      });

      (getAllDepartments as jest.Mock).mockResolvedValue({
        data: mockDepartments,
      });

      (updateCourse as jest.Mock).mockResolvedValue({});

      render(
        <MemoryRouter initialEntries={["/course/edit/1"]}>
          <Routes>
            <Route
              path="/course/edit/:id"
              element={<EditCourse />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("BCA")
        ).toBeInTheDocument();
      });

      fireEvent.change(
        screen.getByPlaceholderText("Course Name"),
        {
          target: {
            value: "MCA",
            name: "name",
          },
        }
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /update course/i,
        })
      );

      await waitFor(() => {
        expect(updateCourse).toHaveBeenCalledWith(1, {
          id: 1,
          name: "MCA",
          dep_id: 1,
        });

        expect(window.alert).toHaveBeenCalledWith(
          "Course updated successfully"
        );

        expect(mockNavigate).toHaveBeenCalledWith(
          "/course/management"
        );
      });
    });

    test("shows update failure alert", async () => {
      (getCourseById as jest.Mock).mockResolvedValue({
        data: mockCourse,
      });

      (getAllDepartments as jest.Mock).mockResolvedValue({
        data: mockDepartments,
      });

      (updateCourse as jest.Mock).mockRejectedValue({});

      render(
        <MemoryRouter initialEntries={["/course/edit/1"]}>
          <Routes>
            <Route
              path="/course/edit/:id"
              element={<EditCourse />}
            />
          </Routes>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("BCA")
        ).toBeInTheDocument();
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /update course/i,
        })
      );

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          "Failed to update course"
        );
      });
    });
  });
});