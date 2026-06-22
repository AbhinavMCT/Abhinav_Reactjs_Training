import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import "../../styles/student/studentManagement.css";

import { StudentList } from "../../types/Datatypes.ts";

import { deleteStaff, getAllStaff } from "../../services/StaffApi.ts";

import ConfirmModal from "../../components/ConfirmModal.tsx";
import { toast } from "react-toastify";
import DeleteButton from "../../components/DeleteButton.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import Pagination from "../../components/Pagination.tsx";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";

const StaffManagement = () => {
  const [staff, setStaff] = useState<StudentList[]>([]);

  const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const response = await getAllStaff(limit, page, search);

        setStaff(response.data.staff);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, [page, limit, search]);

  const handleDelete = (id: number) => {
    setSelectedId(id);

    setOpenModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteStaff(selectedId);
      toast.success("Deleted SuccessFully");

      setStaff(
        staff.filter((employee) => {
          const employeeInfo = employee;

          return employeeInfo?.id !== selectedId;
        }),
      );
    } catch (error) {
      console.error("Error deleting staff:", error);
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
          <Link to={`/staff/edit/${value}`} className="edit-btn">
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
        <h2>Staff Management</h2>

        <Breadcrumbs />

        <div className="header-actions">
          <div className="table-actions">
            <CommonSearch
              search={search}
              setSearch={setSearch}
              placeholder="Search staff..."
            />
          </div>

          <div className="buttons">
            <Link to="/subject-staff" className="create-btn">
            Allocate Subject to Staff
          </Link>

            <Link to="/staff-management/register" className="create-btn">
            + Create Staff
          </Link>

          </div>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading staff...</p>
        ) : (
          <CommonTable data={staff} columns={columns} />
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
        title="Delete Staff"
        message="Are you sure you want to delete this staff?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenModal(false);

          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default StaffManagement;
