import { useEffect, useState, useMemo } from "react";

import { Link } from "react-router-dom";

import { getAllCourses, deleteCourse } from "../../services/CourseApi.ts";

import { CoursePayload } from "../../types/Datatypes.ts";
import ConfirmModal from "../../components/ConfirmModal.tsx";
import DeleteButton from "../../components/DeleteButton.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import Pagination from "../../components/Pagination.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";

const CourseManagement = () => {
  const [courses, setCourses] = useState<CoursePayload[]>([]);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getAllCourses(limit, page, search);

        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);

        setCourses(response.data.course);
        console.log(response.data.course)
      } catch (error) {
        console.error("Failed to load courses:", error);

      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [page, limit, search]);

  const handleDelete = (id: number) => {
    setSelectedId(id);

    setOpenModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteCourse(selectedId);

      setCourses((prev) => prev.filter((course) => course.id !== selectedId));
    } catch (error) {
      console.error("Error deleting course:", error);
    } finally {
      setOpenModal(false);

      setSelectedId(null);
    }
  };

  const columns = useMemo<Column<CoursePayload>[]>(() => [
  {
    title: "ID",
    key: "id",
  },
  {
    title: "Course Name",
    key: "name",
  },
  {
    title: "Department Name",
    key: "department_name",
  },
  {
    title: "Actions",
    key: "id",
    render: (value) => (
      <div className="action-buttons">
        <Link
          to={`/course-management/edit/${value}`}
          className="edit-btn"
        >
          Edit
        </Link>

        <DeleteButton
          id={Number(value)}
          onDelete={handleDelete}
        />
      </div>
    ),
  },
], []);

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Course Management</h2>
        <Breadcrumbs />
        <div className="header-actions">
          <div className="table-actions">
            <CommonSearch
              search={search}
              setSearch={setSearch}
              placeholder="Search Course..."
            />
          </div>

          <div className="buttons">
            <Link to="/course-management/add" className="create-btn">
          + Create Course
        </Link>
          </div>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <CommonTable data={courses} columns={columns} rowKey="id" />
        )}
      </div>
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

      <ConfirmModal
        isOpen={openModal}
        title="Delete Course"
        message="Are you sure you want to delete this course?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenModal(false);

          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default CourseManagement;
