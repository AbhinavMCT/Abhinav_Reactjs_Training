import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllSubjects, deleteSubject } from "../../services/SubjectApi.ts";
import { SubjectPayload } from "../../types/Datatypes.ts";

import "../../styles/subject/SubjectManagement.css";
import ConfirmModal from "../../components/ConfirmModal.tsx";
import { toast } from "react-toastify";
import DeleteButton from "../../components/DeleteButton.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import Pagination from "../../components/Pagination.tsx";
import CommonTable, { Column } from "../../components/ViewComponent.tsx";
import CommonSearch from "../../components/CommonSearch.tsx";

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState<SubjectPayload[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(5);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await getAllSubjects(limit, page, search);

        setTotalPages(res.data.totalPages);
        setSubjects(res.data.subject);
        console.log(res);
        setTotalRecords(res.data.totalRecords);
      } catch (error) {
        console.error("Failed to load Data", error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, [page, limit, search]);

  const handleDelete = async (id: number) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteSubject(selectedId);
      toast.success("Deleted SuccessFully");
      setSubjects((prev) =>
        prev.filter((subject) => {
          return subject.id !== selectedId;
        }),
      );
    } catch (error) {
      console.error("Error in deleting Subject", error);
    } finally {
      setSelectedId(null);
      setOpenModal(false);
    }
  };

  const columns = useMemo<Column<SubjectPayload>[]>(() => {  
  return [
    { title: "ID", key: "id" },
    { title: "Name", key: "name" },
    { title: "Type", key: "type" },
    { title: "Course_name", key: "course_name" },
    {
      title: "Actions",
      key: "id",
      render: (value) => (
        <div className="action-buttons">
          <Link to={`/subject-management/edit/${value}`} className="edit-btn">Edit</Link>
          <DeleteButton id={Number(value)} onDelete={handleDelete} />
        </div>
      ),
    },
  ];
}, []); 

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Subject Management</h2>
        <Breadcrumbs />
        <div className="header-actions">
          <div className="table-actions">
            <CommonSearch
              search={search}
              setSearch={setSearch}
              placeholder="Search Subject..."
            />
          </div>

          <div className="buttons">
            <Link to="/subject-management/add" className="create-btn">
          + Create Subject
        </Link>
          </div>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading subjects...</p>
        ) : (
          <CommonTable data={subjects} columns={columns}  rowKey="id"/>
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
        title="Delete Subject"
        message="Are you sure you want to delete this subject?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenModal(false);

          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default SubjectManagement;
