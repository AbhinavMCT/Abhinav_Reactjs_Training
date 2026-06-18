import { useState, useEffect } from "react";
import { Attendence } from "../../types/Datatypes.ts";
import { getallattenndence } from "../../services/AttendenceApi.ts";
import { Link } from "react-router-dom";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import Pagination from "../../components/Pagination.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";
import "../../styles/attendence/viewattendence.css";
import getSemesterName from "../../utils/semester.ts";

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
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [reportType, setReportType] = useState("daily");

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
        });

        setFormData(res.data.attendence);
        setTotalPages(res.data.totalPages);
        setTotalRecords(res.data.totalRecords);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, limit, search, date, status, reportType, month, year]);

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
          <CommonTable data={formData} columns={columns} />
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
    </div>
  );
};

export default Viewattendence;
