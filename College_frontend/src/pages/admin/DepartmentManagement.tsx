import { useEffect, useState } from "react";
import {
  deleteDepartment,
  getDepartments,
} from "../../services/DepartmentApi.ts";
import { Department } from "../../types/Datatypes.ts";
import { Link } from "react-router-dom";

import "../../styles/department/DepartmentManagement.css";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal.tsx";
import DeleteButton from "../../components/DeleteButton.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import Pagination from "../../components/Pagination.tsx";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments(limit, page, search);
        console.log(response);
        setTotalPages(response.totalPages);
        setTotalRecords(response.totalRecords);

        setDepartments(response.department);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [page, limit, search]);

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteDepartment(selectedId);
      toast.success("Deleted SuccessFully");

      setDepartments((prev) =>
        prev.filter((dep) => {
          return dep.id !== selectedId;
        }),
      );
    } catch (error) {
      console.error("Error in Deleting", error);
    } finally {
      setSelectedId(null);
      setOpenModal(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading-state">
        Loading departments matrix...
      </div>
    );
  }

  const columns: Column<Department>[] = [
    {
      title: "ID",
      key: "id",
    },
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Type",
      key: "type",
    },
    {
      title: "Office Location",
      key: "office_location",
    },
    {
      title: "Established Year",
      key: "established_year",
    },
    {
      title: "Actions",
      key: "id",
      render: (value) => (
        <div className="action-buttons">
          <Link
            to={`/department-management/edit/${value}`}
            className="edit-btn"
          >
            Edit
          </Link>

          <DeleteButton id={Number(value)} onDelete={handleDelete} />
        </div>
      ),
    },
  ];

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>Department Management</h1>
        <Breadcrumbs />
        <Link to="/department-management/add" className="btn-create-link">
          + Create Department
        </Link>
        <div className="table-actions">
          <CommonSearch
            search={search}
            setSearch={setSearch}
            placeholder="Search Department..."
          />
        </div>
      </div>

      <div className="table-viewport-card">
        <CommonTable data={departments} columns={columns} />
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
        title="Delete Department"
        message="Are you sure you want to delete this department?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenModal(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default DepartmentManagement;
