import { useState, useEffect, useMemo } from "react";
import { StudentCourse } from "../../types/Datatypes.ts";
import {
  getStudentCourse,
  deleteStudentCourse,
} from "../../services/StudentCourseApi.ts";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal.tsx";
import { Link } from "react-router-dom";
import DeleteButton from "../../components/DeleteButton.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import Pagination from "../../components/Pagination.tsx";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";

const AllocateStudentCourse = () => {
  const [allocation, setAllocation] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, settotalRecords] = useState(0);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAllocated = async () => {
      try {
        const res = await getStudentCourse(limit, page, search);
        setAllocation(res.data.studentcourse);
        setTotalPages(res.data.totalPages);
        settotalRecords(res.data.totalRecords);
      } catch (error) {
        console.error("Error Fetching Data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllocated();
  }, [page, limit, search]);

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteStudentCourse(selectedId);
      toast.success("Deleted SuccessFully");
      setAllocation((prev) =>
        prev.filter((allocation) => allocation.id !== selectedId),
      );
    } catch (error) {
      console.error("Error deleting allocation", error);
    } finally {
      setOpenModal(false);
      setSelectedId(null);
    }
  };

  const columns= useMemo<Column<StudentCourse>[]>(() => [
    {
      title: "ID",
      key: "id",
    },
    {
      title: "Student Name",
      key: "student_name",
    },
    {
      title: "Course Name",
      key: "course_name",
    },
    {
      title: "Actions",
      key: "id",
      render: (value) => (
        <div className="action-buttons">
          <Link to={`/student-course/edit/${value}`} className="edit-btn">
            Edit
          </Link>

          <DeleteButton id={Number(value)} onDelete={handleDelete} />
        </div>
      ),
    }
  ],[]);

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Student-Course Allocation Management</h2>
        <Breadcrumbs />
        <div className="header-actions">
          <div className="table-actions">
            <CommonSearch
              search={search}
              setSearch={setSearch}
              placeholder="Search Allocated Data..."
            />
          </div>

          <div className="buttons">
            <Link to="/student-course/add" className="create-btn">
          + Allocate New
        </Link>
          </div>
        </div>
      </div>
      <div className="table-container">
        {loading ? (
          <p>Loading Allocated Student-Course matrices...</p>
        ) : (
          <CommonTable data={allocation} columns={columns}  rowKey="id"/>
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
        title="Delete Student-Course Allocation"
        message="Are you sure you want to delete this allocation?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenModal(false);

          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default AllocateStudentCourse;
