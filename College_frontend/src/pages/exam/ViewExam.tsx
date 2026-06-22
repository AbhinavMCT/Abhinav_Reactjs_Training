import { useEffect, useState } from "react";
import { getExamstudents } from "../../services/ExamApi.ts";
import { Exam } from "../../types/Datatypes.ts";
import "../../styles/student/studentManagement.css";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";

const ViewExamsStudents = () => {
  const [exams, setExams] = useState<Exam[]>([]);

  const [loading, setLoading] = useState(true);


  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadExams = async () => {
      try {
        const response = await getExamstudents(search);
        console.log("response",response.data);
        setExams(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to Load Data")
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [search]);


  const columns: Column<Exam>[] = [
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Semester",
      key: "semester",
    },
    {
      title: "Exam Date",
      key: "exam_date",
      render: (value) =>
        value ? new Date(value as string).toLocaleDateString() : "N/A",
    },
    {
      title: "Course name",
      key: "course_name",
    },
    {
      title: "Exam Type",
      key: "exam_type",
    },
  ];

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Exam Management</h2>
        <Breadcrumbs />
        <div className="header-actions">
          <div className="table-actions">
            <CommonSearch
              search={search}
              setSearch={setSearch}
              placeholder="Search Exam..."
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading exams...</p>
        ) : (
          <CommonTable data={exams} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default ViewExamsStudents;
