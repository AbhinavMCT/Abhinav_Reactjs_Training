import { useState, useEffect, useCallback } from "react";
import {
  Attendence,
  Courselist,
  Updatemarkattendance,
} from "../../types/Datatypes.ts";
import {
  getallattenndence,
  updatemarkedAttendence,
  getAllCourse,
} from "../../services/AttendenceApi.ts";
import { Link } from "react-router-dom";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import Pagination from "../../components/Pagination.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";
import "../../styles/attendence/viewattendence.css";
import getSemesterName from "../../utils/semester.ts";
import { toast } from "react-toastify";

const Viewattendence = () => {
  const [formData, setFormData] = useState<Attendence[]>([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("present");
  const [date, setDate] = useState("");
  const [courses, setCourses] = useState<Courselist[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [reportType, setReportType] = useState("daily");

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedAttendance, setSelectedAttendance] =
    useState<Updatemarkattendance | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      

      try {
        const res = await getallattenndence({
          page,
          limit,
          search,
          date,
          status,
          reportType,
          month,
          year,
          course_id: selectedCourse,
        });

        console.log("Selected Course:", selectedCourse);

        setFormData(res.data.attendence);
        console.log(res.data);
        setTotalPages(res.data.totalPages);
        setTotalRecords(res.data.totalRecords);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    page,
    limit,
    search,
    date,
    status,
    reportType,
    month,
    year,
    selectedCourse,
  ]);

  const loadCourses = useCallback(async () => {
    try {
      const res = await getAllCourse();

      setCourses(res.data);


    } catch (error) {
      console.error(error);
      toast.error("Failed to load courses");
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleUpdateAttendance = async () => {
    if (!selectedAttendance) return;

    try {
      await updatemarkedAttendence(
        selectedAttendance.id,
        selectedAttendance.status,
        selectedAttendance.attendance_date,
        selectedAttendance.semester,
        selectedAttendance.course_id,
      );

      toast.success("Attendance Updated");

      setIsEditOpen(false);
      console.log({
        page,
        limit,
        search,
        date,
        status,
        reportType,
        month,
        year,
        selectedCourse,
      });

      const res = await getallattenndence({
        page,
        limit,
        search,
        date,
        status,
        reportType,
        month,
        year,
        course_id: selectedCourse,
      });

      setFormData(res.data.attendence);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update attendance");
    }
  };

  const handleEdit = (row: Updatemarkattendance) => {
    setSelectedAttendance(row);
    setIsEditOpen(true);
  };

  const columns = (
    date
      ? [
          {
            title: "Student Name",
            key: "name",
          },
          {
            title: "Semester",
            key: "semester",
            render: (value) => getSemesterName(Number(value)),
          },
          {
            title: "Status",
            key: "status",
          },
          {
            title: "Attendance Date",
            key: "attendance_date",
            render: (value) =>
              value ? new Date(value as string).toLocaleDateString() : "N/A",
          },
          {
            title: "Action",
            key: "action",
            render: (_: any, row: Updatemarkattendance) => (
              <button className="edit-btn" onClick={() => handleEdit(row)}>
                Edit
              </button>
            ),
          },
        ]
      : [
          {
            title: "Student Name",
            key: "name",
          },
          {
            title: "Semester",
            key: "semester",
            render: (value) => getSemesterName(Number(value)),
          },
          {
            title: "Total Working Days",
            key: "total_working_days",
          },
        ]
  ) as Column<Attendence>[];

  console.log("courses =", courses);
console.log("Array?", Array.isArray(courses));
  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Attendance Management</h2>

        <Breadcrumbs />

        <Link to="/view-all-attendence/mark-attendence" className="create-btn">
          + Add Attendance
        </Link>

        <div className="table-actions">
          <CommonSearch
            search={search}
            setSearch={setSearch}
            placeholder="Search Student..."
          />

          <select
            className="modern-select"
            value={selectedCourse}
            onChange={(e) =>
              setSelectedCourse(Number.parseInt(e.target.value, 10))
            }
          >
            <option value={0}>Select Course</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>

          {reportType === "daily" && (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          )}

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {reportType === "monthly" && (
            <>
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Select Month</option>
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

          {date && (
            <button
              className="clear-filter-btn"
              onClick={() => {
                setDate("");
                setPage(1);
              }}
            >
              Clear Date
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

        <div className="pagination-controls">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalRecords={totalRecords}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      </div>
      {isEditOpen && selectedAttendance && (
        <div className="attendance-modal-overlay">
          <div className="attendance-modal">
            <h3>Edit Attendance</h3>

            <div className="form-group">
              <label htmlFor="name">Status</label>

              <select
                name="name"
                value={selectedAttendance.status}
                onChange={(e) =>
                  setSelectedAttendance({
                    ...selectedAttendance,
                    status: e.target.value,
                  })
                }
              >
                <option value="present">Present</option>

                <option value="absent">Absent</option>

                <option value="leave">Leave</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="save-btn" onClick={handleUpdateAttendance}>
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Viewattendence;
