import { useState, useEffect } from "react";
import { getMarkbylogin } from "../../services/MarkApi.ts";
import { Marks } from "../../types/Datatypes.ts";
import { toast } from "react-toastify";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import "../../styles/mark/ViewProfileMark.css";

const ViewProfileMark = () => {
  const [marks, setMarks] = useState<Marks[]>([]);
  const [semester, setSemester] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMarks();
  }, [semester]);

  const loadMarks = async () => {
    try {
      setLoading(true);

      const res = await getMarkbylogin(semester);
      console.log("API Response:", res);
console.log("Response Data:", res.data);

      setMarks(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch marks");
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<Marks>[] = [
    {
      title: "Subject",
      key: "subject_name",
    },
    {
      title: "Obtained Mark",
      key: "obtained_mark",
    },
    {
      title: "Maximum Mark",
      key: "maximum_mark",
    },
    {
      title: "Percentage",
      key: "percentage",
      render: (value) => `${value}%`,
    },
  ];

  return (
    <div className="result-page">
      <div className="result-card">
        <Breadcrumbs />

        <div className="result-header">
          <h2>My Results</h2>
          <p>semester-wise examination results</p>
        </div>

        <div className="filter-section">
          <label htmlFor="sem">Select Semester</label>

          <select
            name="sem"
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
          >
            <option value={1}>Semester 1</option>
            <option value={2}>Semester 2</option>
            <option value={3}>Semester 3</option>
            <option value={4}>Semester 4</option>
          </select>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <p className="loading-text">Loading Results...</p>
          ) : (
            <CommonTable data={marks} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfileMark;
