import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { getAllStudents, deleteStudent } from "../../services/StudentApi.ts";

import "../../styles/student/studentManagement.css";
import { RegisterPayload, StudentList } from "../../types/Datatypes.ts";
import ConfirmModal from "../../components/ConfirmModal.tsx";
import { toast } from "react-toastify";
import DeleteButton from "../../components/DeleteButton.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import Pagination from "../../components/Pagination.tsx";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";

const StudentManagement = () => {
  const [students, setStudents] = useState<StudentList[]>([]);

  const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await getAllStudents(page, limit, search);

        setStudents(response.data.students);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [page, limit, search]);

  const handleDelete = (id: number) => {
    setSelectedId(id);

    setOpenModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteStudent(selectedId);
      toast.success("Deleted SuccessFully");
      setStudents((prevStudents) =>
        prevStudents.filter((student) => {
          const studentInfo = student;

          return studentInfo?.id !== selectedId;
        }),
      );
    } catch (error) {
      console.error("Error deleting student:", error);
    } finally {
      setOpenModal(false);

      setSelectedId(null);
    }
  };

  const columns: Column<StudentList>[] = [
    {
      title: "ID",
      key: "id",
    },
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Email",
      key: "email",
    },
    {
      title: "Contact",
      key: "contact",
    },
    {
      title: "DOB",
      key: "DOB",
      render: (value) =>
        value ? new Date(value as string).toLocaleDateString() : "N/A",
    },
    {
      title: "Gender",
      key: "gender",
    },
    {
      title: "City",
      key: "city",
    },
    {
      title: "District",
      key: "district",
    },
    {
      title: "State",
      key: "state",
    },
    {
      title: "Pin",
      key: "pin",
    },
    {
      title: "Actions",
      key: "id",
      render: (value) => (
        <div className="action-buttons">
          <Link to={`/student/edit/${value}`} className="edit-btn">
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
        <h2>Student Management</h2>
        <Breadcrumbs />
        <div className="buttons">
          <Link to="/student-course" className="create-btn">
            + Allocate Course
          </Link>

          <Link to="/student-management/register" className="create-btn">
            + Create Student
          </Link>
          <div className="table-actions">
            <CommonSearch
              search={search}
              setSearch={setSearch}
              placeholder="Search Student..."
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading students...</p>
        ) : (
          <CommonTable data={students} columns={columns} />
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
        title="Delete Student"
        message="Are you sure you want to delete this student?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenModal(false);

          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default StudentManagement;
