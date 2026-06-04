import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  getAllExams,
  deleteExam,
} from "../../services/ExamApi.ts";

import { Exam } from "../../types/Datatypes.ts";

import "../../styles/student/studentManagement.css";
import ConfirmModal from "../../components/ConfirmModal.tsx";
import { toast } from "react-toastify";

const ExamManagement = () => {
  const [exams, setExams] = useState<Exam[]>([]);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
  const loadExams = async () => {
    try {
      const response = await getAllExams();

      console.log(response.data);

      setExams(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  loadExams();
}, []);

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const confirmDelete = async()=>{
    if (selectedId === null) return;
    try{
      await deleteExam(selectedId);
      toast.success("Deleted SuccessFully");
      setExams((prev)=>
        prev.filter((exam)=>{
          return exam.id !== selectedId
        })
      );
    }catch(error){
      console.error("Error Deleting Exams", error);
    }finally{
      setSelectedId(null);
      setOpenModal(false)
    }
  };

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Exam Management</h2>

        <Link
          to="/exam/add"
          className="create-btn"
        >
          + Create Exam
        </Link>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading exams...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Semester</th>
                <th>Exam Date</th>
                <th>Course Name</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
                
              {exams.map((exam, index) => {
                const rowKey = `exam-${exam.id}-${index}`;

                return (
                  <tr key={rowKey}>
                    <td>{exam.name}</td>

                    <td>{exam.semester}</td>

                    <td>
                      {new Date(
                        exam.exam_date
                      ).toLocaleDateString()}
                    </td>

                    <td>{exam.course_name}</td>

                    <td className="action-buttons">
                      <Link
                        to={`/exam/edit/${exam.id}`}
                        className="edit-btn"
                      >
                        Edit
                      </Link>

                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (exam.id) {
                            handleDelete(exam.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
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