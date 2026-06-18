import { useEffect, useState } from "react";
import { markAttendance } from "../../services/AttendenceApi.ts";
import { getAllStudents } from "../../services/StudentApi.ts";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import "../../styles/attendence/markattendance.css";

interface Student {
  id: number;
  name: string;
}

const MarkAttendance = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [semester, setSemester] = useState(1);

  const [attendance, setAttendance] = useState<
    {
      student_id: number;
      status: string;
    }[]
  >([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await getAllStudents(1, 10, "");

      setStudents(res.data.students);

      setAttendance(
        res.data.students.map((student: Student) => ({
          student_id: student.id,
          status: "Present",
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = (
    studentId: number,
    status: string
  ) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.student_id === studentId
          ? { ...record, status }
          : record
      )
    );
  };

  const handleSubmit = async () => {
    if (!attendanceDate) {
      toast.error("Please select attendance date");
      return;
    }

    try {
      await markAttendance({
        attendance,
        attendance_date: attendanceDate,
        semester,
      });

      toast.success("Attendance marked successfully");
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
            className="modern-date"
            type="date"
            name="date"
            value={attendanceDate}
            onChange={(e) =>
              setAttendanceDate(e.target.value)
            }
          />
        </div>

        <div className="filter-group">
          <label htmlFor="sem">Semester</label>
          <select
          name="sem"
            className="modern-select"
            value={semester}
            onChange={(e) =>
              setSemester(Number(e.target.value))
            }
          >
            <option value={1}>Semester 1</option>
            <option value={2}>Semester 2</option>
            <option value={3}>Semester 3</option>
            <option value={4}>Semester 4</option>
          </select>
        </div>
      </div>

      <div className="attendance-table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Attendance Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="student-name">
                  👨‍🎓 {student.name}
                </td>

                <td>
                  <select
                    className={`status-select ${
                      attendance
                        .find(
                          (a) =>
                            a.student_id === student.id
                        )
                        ?.status.toLowerCase()
                    }`}
                    value={
                      attendance.find(
                        (a) =>
                          a.student_id === student.id
                      )?.status
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        student.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Present">
                      Present
                    </option>

                    <option value="Absent">
                      Absent
                    </option>

                    <option value="Leave">
                      Leave
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="submit-btn"
        onClick={handleSubmit}
      >
        Submit Attendance
      </button>
    </div>
  );
};

export default MarkAttendance;