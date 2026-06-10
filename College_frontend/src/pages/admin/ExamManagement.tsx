import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getAllExams, deleteExam } from "../../services/ExamApi.ts";

import { Exam } from "../../types/Datatypes.ts";

import "../../styles/student/studentManagement.css";
import ConfirmModal from "../../components/ConfirmModal.tsx";
import { toast } from "react-toastify";
import DeleteButton from "../../components/DeleteButton.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import Pagination from "../../components/Pagination.tsx";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";

const ExamManagement = () => {
  const [exams, setExams] = useState<Exam[]>([]);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadExams = async () => {
      try {
        const response = await getAllExams(limit, page, search);

        setExams(response.data.exam);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [limit, page, search]);

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const confirmDelete = async () => {
    if (selectedId === null) return;
    try {
      await deleteExam(selectedId);
      toast.success("Deleted SuccessFully");
      setExams((prev) =>
        prev.filter((exam) => {
          return exam.id !== selectedId;
        }),
      );
      console.log("exam",exams);
    } catch (error) {
      console.error("Error Deleting Exams", error);
    } finally {
      setSelectedId(null);
      setOpenModal(false);
    }
  };

  const columns: Column<Exam>[] = [
    {
      title: "ID",
      key: "id",
    },
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
    },
    {
      title: "Course name",
      key: "course_name",
    },
    {
      title: "Actions",
      key: "id",
      render: (value) => (
        <div className="action-buttons">
          <Link to={`/exam-management/edit/${value}`} className="edit-btn">
            Edit
          </Link>

          <DeleteButton id={Number(value)} onDelete={handleDelete} />
        </div>
      ),
    },
  ];

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Exam Management</h2>
        <Breadcrumbs />
        <Link to="/exam-management/add" className="create-btn">
          + Create Exam
        </Link>
        <div className="table-actions">
          <CommonSearch
            search={search}
            setSearch={setSearch}
            placeholder="Search Exam..."
          />
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading exams...</p>
        ) : (
          <CommonTable data={exams} columns={columns} />
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
        title="Delete Exam"
        message="Are you sure you want to delete this exam?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenModal(false);

          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default ExamManagement;
