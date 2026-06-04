import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllSubjects, deleteSubject } from "../../services/SubjectApi.ts";
import { SubjectPayload } from "../../types/Datatypes.ts";

import "../../styles/subject/SubjectManagement.css";
import ConfirmModal from "../../components/ConfirmModal.tsx";
import { toast } from "react-toastify";



const SubjectManagement = () => {
  const [subjects, setSubjects] = useState<SubjectPayload[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
    const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
  const loadSubjects = async () => {
    try {
      const res = await getAllSubjects();

      setSubjects(res.data);

    } catch (error) {
      console.error("Failed to load Data", error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  loadSubjects();
}, []);

  const handleDelete = async (id: number) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const confirmDelete = async() =>{
    if(!selectedId) return;
    try{
      await deleteSubject(selectedId);
      toast.success("Deleted SuccessFully");
      setSubjects((prev)=>
        prev.filter((subject)=>{
          return subject.id !== selectedId
        })
      );
    }catch(error){
      console.error("Error in deleting Subject", error)
    }finally{
      setSelectedId(null);
      setOpenModal(false);
    }
  };

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Subject Management</h2>

        <Link to="/subject/add" className="create-btn">
          + Create Subject
        </Link>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading subjects...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject Name</th>
                <th>Classification Type</th>
                <th>Course Name</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(subjects) && subjects.length > 0 ? (
                subjects.map((subject) => {
                  const recordId =
  subject.id ?? `subject-${subject.course_id}-${subject.name}`;

                  return (
                    <tr key={recordId}>
                      <td>{subject?.id ?? "N/A"}</td>
                      <td>{subject?.name ?? "N/A"}</td>
                      <td>{subject?.type ?? "N/A"}</td>
                      
                      <td>{subject?.course_name ?? `course_id: ${subject.course_id}`}</td>

                      <td className="action-buttons">
                        <Link
                          to={`/subject/edit/${subject.id}`}
                          className="edit-btn"
                        >
                          Edit
                        </Link>
                        <button
                          className="delete-btn"
                          onClick={() => {
                            if (subject.id) {
                              handleDelete(subject.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No subjects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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

export default SubjectManagement;