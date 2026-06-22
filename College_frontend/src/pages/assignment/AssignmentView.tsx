import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getAllAssignments,
  deleteAssignment,
} from "../../services/AssignmentApi.ts";

import { Assignment } from "../../types/Datatypes.ts";

import DeleteButton from "../../components/DeleteButton.tsx";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import ConfirmModal from "../../components/ConfirmModal.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import Pagination from "../../components/Pagination.tsx";

import "../../styles/assignment/viewassignment.css";

const AssignmentView = () => {
  const [assignment, setAssignment] = useState<Assignment[]>([]);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalRecords, setTotalRecords] = useState(0);

  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const res = await getAllAssignments({
          page,
          limit,
          search,
          status,
          startDate,
          endDate,
        });

        setAssignment(res.data.assignments);
        console.log(res.data.assignments);

        setTotalPages(res.data.totalPages || 1);

        setTotalRecords(res.data.totalRecords || 0);
      } catch (error) {
        console.error(error);

        toast.error("Error Loading Assignments");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, limit, search, status, startDate, endDate]);

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const confirmDelete = async () => {
    if (selectedId === null) return;

    try {
      await deleteAssignment(selectedId);

      toast.success("Assignment Deleted Successfully");

      setAssignment((prev) => prev.filter((item) => item.id !== selectedId));
    } catch (error) {
      console.error(error);

      toast.error("Failed To Delete Assignment");
    } finally {
      setSelectedId(null);
      setOpenModal(false);
    }
  };

  const columns: Column<Assignment>[] = [
    {
      title: "ID",
      key: "id",
    },
    {
      title: "Assignment Name",
      key: "assignment_name",
    },
    {
      title: "Description",
      key: "description",
    },
    {
      title: "Start Date",
      key: "start_date",
      render: (value) =>
        value ? new Date(value as string).toLocaleDateString() : "N/A",
    },
    {
      title: "End Date",
      key: "end_date",
      render: (value) =>
        value ? new Date(value as string).toLocaleDateString() : "N/A",
    },
    {
      title: "Subject",
      key: "subject_name",
    },
    {
      title: "Status",
      key: "status",
    },
    {
      title: "Actions",
      key: "id",
      render: (value) => (
        <div className="action-buttons">
          <Link to={`/assignment-view/edit/${value}`} className="edit-btn">
            Edit
          </Link>

          <DeleteButton id={Number(value)} onDelete={handleDelete} />
        </div>
      ),
    },
  ];

  return (
    <div className="assignment-container">
      <div className="management-header">
        <h2>Assignment Management</h2>

        <Breadcrumbs />

        <Link to="/assignment-view/add" className="create-btn">
          + Add Assignment
        </Link>
      </div>

      <div className="table-actions">
        <CommonSearch
          search={search}
          setSearch={setSearch}
          placeholder="Search Assignments..."
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>

          <option value="LATE">LATE</option>
          <option value="NOT SUBMITTED">NOT SUBMITTED</option>
          <option value="SUBMITTED">SUBMITTED</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading Assignments...</p>
        ) : (
          <CommonTable data={assignment} columns={columns} />
        )}

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
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenModal(false);

          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default AssignmentView;
