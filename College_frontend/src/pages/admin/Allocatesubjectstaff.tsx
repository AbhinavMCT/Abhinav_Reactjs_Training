import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  getAllSubjectStaff,
  deleteSubjectStaff,
} from "../../services/SubjectStaffApi.ts";
import DeleteButton from "../../components/DeleteButton.tsx";
import { SubjectStaffPayload } from "../../types/Datatypes.ts";
import ConfirmModal from "../../components/ConfirmModal.tsx";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import Pagination from "../../components/Pagination.tsx";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";

const AllocateSubjectStaff = () => {
  const [allocations, setAllocations] = useState<SubjectStaffPayload[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadAllocated = async () => {
      try {
        const res = await getAllSubjectStaff(limit, page, search);
        setTotalPages(res.data.totalPages);
        setTotalRecords(res.data.totalRecords);
        setAllocations(res.data.staffsubject);
      } catch (error) {
        console.error("Failed to load Data", error);
        setAllocations([]);
      } finally {
        setLoading(false);
      }
    };
    loadAllocated();
  }, [page, limit, search]);

  const handleDelete = (id: number) => {
    setSelectedId(id);

    setOpenModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteSubjectStaff(selectedId);
      toast.success("Deleted SuccessFully");

      setAllocations((prev) =>
        prev.filter((allocation) => allocation.id !== selectedId),
      );
    } catch (error) {
      console.error("Error deleting allocation:", error);
    } finally {
      setOpenModal(false);

      setSelectedId(null);
    }
  };

  const columns = useMemo<Column<SubjectStaffPayload>[]>(()=>[
    {
      title: "ID",
      key: "id",
    },
    {
      title: "Staff Name",
      key: "staff_name",
    },
    {
      title: "Subject Name",
      key: "subject_name",
    },
    {
      title: "Actions",
      key: "id",
      render: (value) => (
        <div className="action-buttons">
          <Link to={`/subject-staff/edit/${value}`} className="edit-btn">
            Edit
          </Link>

          <DeleteButton id={Number(value)} onDelete={handleDelete} />
        </div>
      ),
    },
  ],[]) 

  return (
    <div className="student-management-container">
      <Breadcrumbs />
      <div className="management-header">
        <h2>Subject to Staff Allocation Management</h2>
        <div className="header-actions">
          <div className="table-actions">
            <CommonSearch
              search={search}
              setSearch={setSearch}
              placeholder="Search Allocated Data..."
            />
          </div>

          <div className="buttons">
            <Link to="/subject-staff/add" className="create-btn">
              + Allocate New
            </Link>
          </div>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading Allocated Staff and Subject matrices...</p>
        ) : (
          <CommonTable data={allocations} columns={columns}  rowKey="id"/>
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

export default AllocateSubjectStaff;
