import { useState, useEffect, useMemo } from "react";
import {getMarks,deleteMarks,downloadStudentReport} from "../../services/MarkApi.ts";
import { Marks } from "../../types/Datatypes.ts";
import { toast } from "react-toastify";
import CommonTable, {Column} from "../../components/ViewComponent.tsx";
import { Link } from "react-router-dom";
import DeleteButton from "../../components/DeleteButton.tsx";
import ConfirmModal from "../../components/ConfirmModal.tsx";
import Pagination from "../../components/Pagination.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";

const MarkView = () => {
  const [formData, setFormData] = useState<Marks[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");

  const [semester, setSemester] = useState<
    number | undefined
  >(undefined);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await getMarks(
        page,
        limit,
        search,
        semester
      );

      setFormData(res.data.marks);
      console.log(res.data.marks);
      setTotalPages(res.data.totalPages);
      setTotalRecords(res.data.totalRecords);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load marks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, limit, search, semester]);

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const confirmDelete = async () => {
    if (selectedId === null) return;

    try {
      await deleteMarks(selectedId);

      toast.success("Mark deleted successfully");

      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete mark");
    } finally {
      setSelectedId(null);
      setOpenModal(false);
    }
  };

  const handleDownload = async (
    studentId: number
  ) => {
    try {
      const response =
        await downloadStudentReport(studentId);

      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const url =
        globalThis.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download = `student-report-${studentId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove()

      globalThis.URL.revokeObjectURL(url);

      toast.success(
        "Report downloaded successfully"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to download report"
      );
    }
  };

  const columns = useMemo<Column<Marks>[]>(()=>[
    {
      title: "ID",
      key: "id",
    },
    {
      title: "Student Name",
      key: "student_name",
    },
    {
      title: "Subject Name",
      key: "subject_name",
    },
    {
      title: "Exam Name",
      key: "exam_name",
    },
    {
      title: "Mark",
      key: "mark",
    },
    {
      title: "Grade",
      key: "grade",
    },
    {
        title: "Maximum Mark Obtained",
        key: "maximum_mark",
    },
    {
      title: "Actions",
      key: "id",
      render: (value, row) => (
        <div className="action-buttons">
          <Link
            to={`/mark-page/edit/${value}`}
            className="edit-btn"
          >
            Edit
          </Link>

          <button
            className="download-btn"
            onClick={() =>
              handleDownload(
                Number(row.student_id)
              )
            }
          >
            PDF
          </button>

          <DeleteButton
            id={Number(value)}
            onDelete={handleDelete}
          />
        </div>
      ),
    },
  ],[]);

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Mark Management</h2>

        <Breadcrumbs />

        

        <div className="table-actions">
          <CommonSearch
            search={search}
            setSearch={setSearch}
            placeholder="Search Student..."
          />

          

          <div className="filter-section">
            <label htmlFor="semester">
              Semester
            </label>

            <select
              id="semester"
              value={semester ?? ""}
              onChange={(e) =>
                setSemester(
                  e.target.value
                    ? Number(e.target.value)
                    : undefined
                )
              }
            >
              <option value="">
                All Semesters
              </option>
              <option value={1}>
                Semester 1
              </option>
              <option value={2}>
                Semester 2
              </option>
              <option value={3}>
                Semester 3
              </option>
              <option value={4}>
                Semester 4
              </option>
            </select>
          </div>
          <Link
          to="/mark-page/add"
          className="create-btn"
        >
          + Add Mark
        </Link>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading Marks...</p>
        ) : (
          <CommonTable
            data={formData}
            columns={columns}
            rowKey="id"
          />
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

      <ConfirmModal
        isOpen={openModal}
        title="Delete Mark"
        message="Are you sure you want to delete this mark?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenModal(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default MarkView;