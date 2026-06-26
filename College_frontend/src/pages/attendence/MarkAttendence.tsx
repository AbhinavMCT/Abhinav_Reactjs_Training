import { useState, useEffect, useCallback } from "react";
import {
  markAttendance,
  getStudentsByCourse,
  getAllCourse,
} from "../../services/AttendenceApi.ts";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import "../../styles/attendence/markattendance.css";
import { Courselist } from "../../types/Datatypes.ts";
import { useNavigate } from "react-router-dom";

interface Student {
  id: number;
  name: string;
}

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Courselist[]>([]);
  const [courseId, setCourseId] = useState<number>(0);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [semester, setSemester] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const [attendance, setAttendance] = useState<
    {
      student_id: number;
      status: string;
    }[]
  >([]);

  const loadStudentsByCourse = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);

      const res = await getStudentsByCourse(courseId);

      setStudents(res.data);

      setAttendance(
        res.data.map((student: Student) => ({
          student_id: student.id,
          status: "Present",
        })),
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const loadCourses = useCallback(async () => {
    try {
      const res = await getAllCourse();

      setCourses(res.data);

      if (res.data.length > 0) {
        setCourseId(res.data[0].id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load courses");
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (courseId === 0) {
      setStudents([]);
      setAttendance([]);
      return;
    }

    loadStudentsByCourse();
  }, [courseId, loadStudentsByCourse]);

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.student_id === studentId ? { ...record, status } : record,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!attendanceDate) {
      toast.error("Please select attendance date");
      return;
    }

    if (!courseId) {
      toast.error("Please select a course");
      return;
    }

    if (attendance.length === 0) {
      toast.error("No students found");
      return;
    }

    try {
      await markAttendance({
        attendance,
        attendance_date: attendanceDate,
        semester,
        course_id: courseId,
      });

      toast.success("Attendance marked successfully");
      navigate("/view-all-attendence");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark attendance");
    }
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <div>
          <h2>Attendance Management</h2>
          <Breadcrumbs />
        </div>
      </div>

      <div className="attendance-filter-card">
        <div className="filter-group">
          <label htmlFor="date">Attendance Date</label>

          <input
            data-testid="attendance-date-input"
            className="modern-date"
            type="date"
            name="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="course">Course</label>

          <select
            className="modern-select"
            value={courseId}
            onChange={(e) => setCourseId(Number.parseInt(e.target.value, 10))}
          >
            <option value={0}>Select Course</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sem">Semester</label>

          <select
            className="modern-select"
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Semester {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="attendance-table-wrapper">
        {loading ? (
          <div className="loading">Loading students...</div>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Attendance Status</th>
              </tr>
            </thead>

            <tbody>
              {students.length > 0 ? (
                students.map((student) => {
                  const record = attendance.find(
                    (a) => a.student_id === student.id,
                  );

                  return (
                    <tr key={student.id}>
                      <td className="student-name">👨‍🎓 {student.name}</td>

                      <td>
                        <select
                          className={`status-select ${
                            record?.status.toLowerCase() ?? ""
                          }`}
                          value={record?.status ?? "Present"}
                          onChange={(e) =>
                            handleStatusChange(student.id, e.target.value)
                          }
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center" }}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={attendance.length === 0}
      >
        Submit Attendance
      </button>
    </div>
  );
};

export default MarkAttendance;
