import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  getAllExams,
  deleteExam,
} from "../../services/ExamApi.ts";

import { ExamPayload } from "../../types/Datatypes.ts";

import "../../styles/student/studentManagement.css";

const ExamManagement = () => {
  const [exams, setExams] = useState<ExamPayload[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadExams = async () => {
    try {
      const response = await getAllExams();

      console.log(response.data);

      setExams(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  loadExams();
}, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam?"
    );

    if (!confirmDelete) return;

    try {
      await deleteExam(id);

      setExams((prev) =>
        prev.filter((exam) => exam.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Exam Management</h2>

        <Link
          to="/exam/add"
          className="create-btn"
        >
          + Create Exam
        </Link>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading exams...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Semester</th>
                <th>Exam Date</th>
                <th>Course ID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
                {Array.isArray(exams) &&
              exams.map((exam, index) => {
                const rowKey = `exam-${exam.id}-${index}`;

                return (
                  <tr key={rowKey}>
                    <td>{exam.name}</td>

                    <td>{exam.semester}</td>

                    <td>
                      {new Date(
                        exam.exam_date
                      ).toLocaleDateString()}
                    </td>

                    <td>{exam.course_id}</td>

                    <td className="action-buttons">
                      <Link
                        to={`/exam/edit/${exam.id}`}
                        className="edit-btn"
                      >
                        Edit
                      </Link>

                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (exam.id) {
                            handleDelete(exam.id);
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

export default ExamManagement;