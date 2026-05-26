import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { getAllStudents, deleteStudent } from "../../services/StudentApi.ts";

import "../../styles/student/studentManagement.css";
import { RegisterPayload } from "../../types/Datatypes.ts";

const StudentManagement = () => {
  const [students, setStudents] = useState<RegisterPayload[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await getAllStudents();

        setStudents(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!globalThis.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    try {
      await deleteStudent(id);
      setStudents(
        students.filter((student) => {
          const studentInfo = student?.userData || student;
          return studentInfo?.id !== id;
        }),
      );
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Student Management</h2>

        <Link to="/student/register" className="create-btn">
          + Create Student
        </Link>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading students...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>City</th>
                <th>District</th>
                <th>State</th>
                <th>Pin</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => {
                const studentInfo = student?.userData || student;
                const addressInfo = student?.addressData || student;

                const rowKey = `student-${studentInfo?.id || "new"}-${index}`;

                return (
                  <tr key={rowKey}>
                    <td>{studentInfo?.name ?? "N/A"}</td>
                    <td>{studentInfo?.email ?? "N/A"}</td>
                    <td>{studentInfo?.contact ?? "N/A"}</td>
                    <td>{studentInfo?.DOB ?? "N/A"}</td>
                    <td>{studentInfo?.gender ?? "N/A"}</td>

                    <td>{addressInfo?.city ?? "N/A"}</td>
                    <td>{addressInfo?.district ?? "N/A"}</td>
                    <td>{addressInfo?.state ?? "N/A"}</td>
                    <td>{addressInfo?.pin ?? "N/A"}</td>

                    <td className="action-buttons">
                      {studentInfo?.id && (
                        <Link
                          to={`/student/edit/${studentInfo.id}`}
                          className="edit-btn"
                        >
                          Edit
                        </Link>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (studentInfo?.id) {
                            handleDelete(studentInfo.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
