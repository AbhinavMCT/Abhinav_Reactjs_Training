import { useState, useEffect, useCallback } from "react";
import { getattendencebystudent, allocatedcourse } from "../../services/AttendenceApi.ts";
import { Attendence, Courselist } from "../../types/Datatypes.ts";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import "../../styles/attendence/viewattendancestudent.css";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import { toast } from "react-toastify";

const ViewAttendenceStudents = () => {
  const [formData, setFormData] = useState<Attendence[]>([]);
  const [loading, setLoading] = useState(false);

  const [semester, setSemester] = useState(1);
  const [status, setStatus] = useState("present");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [reportType, setReportType] = useState("");
  const [courses, setCourses] = useState<Courselist[]>([]);
    const [selectedCourse, setSelectedCourse] = useState(0);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getattendencebystudent(
        semester,
        date,
        status,
        reportType,
        month,
        year,
        selectedCourse
      );
      console.log("API Response:", res.data);
      setFormData(res.data);
    } catch (error) {
      console.error("Error Fetching Attendance", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [semester, date, status, reportType, month, year,selectedCourse]);

  const loadCourses = useCallback(async () => {
  try {
    const res = await allocatedcourse();

    setCourses(res.data);

    if (res.data.length > 0) {
      setSelectedCourse(res.data[0].id);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to load courses");
  }
}, []);
  
    useEffect(() => {
      loadCourses();
    }, [loadCourses]);

  const columns: Column<Attendence>[] = [
  {
    title: "Semester",
    key: "semester_name",
  },
  {
    title: "Present Days",
    key: "present_days",
    render: (value) => value ?? "-",
  },
  {
    title: "Absent Days",
    key: "absent_days",
    render: (value) => value ?? "-",
  },
  {
    title: "Total Working Days",
    key: "total_working_days",
  },
  {
    title: "Attendance %",
    key: "attendance_percentage",
    render: (value) => (value === undefined ? "-" : `${value}%`),
  },
];

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>My Attendance</h2>

        <Breadcrumbs />

        <div className="table-actions">
          <select
            value={semester}
            onChange={(e) => {
              setSemester(Number(e.target.value));
            }}
          >
            <option value={1}>Semester 1</option>
            <option value={2}>Semester 2</option>
            <option value={3}>Semester 3</option>
            <option value={4}>Semester 4</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>

          <select
  value={selectedCourse}
  onChange={(e) => setSelectedCourse(Number(e.target.value))}
>
  <option value={0}>Select Course</option>

  {courses.map((course) => (
    <option key={course.id} value={course.id}>
      {course.name}
    </option>
  ))}
</select>

          <select
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);

              setDate("");
              setMonth("");
              setYear("");
            }}
          >
            <option value="">Overall</option>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {reportType === "daily" && (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          )}

          {reportType === "monthly" && (
            <>
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Month</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>

              <input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </>
          )}

          {reportType === "yearly" && (
            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          )}

          {(date || month || year) && (
            <button
              className="clear-filter-btn"
              onClick={() => {
                setDate("");
                setMonth("");
                setYear("");
                setReportType("");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading attendance...</p>
        ) : (
          <CommonTable data={formData} columns={columns} rowKey="id"/>
        )}
      </div>
    </div>
  );
};

export default ViewAttendenceStudents;
