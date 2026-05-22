import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getAllCourses, deleteCourse } from "../../services/CourseApi.ts";

import { CoursePayload } from "../../types/Datatypes.ts";



const CourseManagement = () => {
  const [courses, setCourses] = useState<CoursePayload[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getAllCourses();

        console.log(response.data);

        if (Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Failed to load courses:", error);

        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (!confirmDelete) return;

    try {
      await deleteCourse(id);

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id),
      );

      alert("Course deleted successfully");
    } catch (error) {
      console.error("Error deleting course:", error);

      alert("Failed to delete course");
    }
  };

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Course Management</h2>

        <Link to="/course/add" className="create-btn">
          + Create Course
        </Link>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>

                <th>Course Name</th>

                <th>Department ID</th>

                <th>Department Name</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(courses) && courses.length > 0 ? (
                courses.map((course, index) => {
                  const rowKey = `course-${course.id}-${index}`;

                  return (
                    <tr key={rowKey}>
                      <td>{course.id ?? "N/A"}</td>

                      <td>{course.name ?? "N/A"}</td>

                      <td>{course.dep_id ?? "N/A"}</td>

                      <td>{course.department_name ?? "N/A"}</td>

                      <td className="action-buttons">
                        <Link
                          to={`/course/edit/${course.id}`}
                          className="edit-btn"
                        >
                          Edit
                        </Link>

                        <button
                          className="delete-btn"
                          onClick={() => {
                            if (course.id) {
                              handleDelete(course.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
