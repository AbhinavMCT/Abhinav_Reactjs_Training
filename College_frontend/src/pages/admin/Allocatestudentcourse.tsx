import {useState, useEffect} from "react";
import {StudentCourse,} from "../../types/Datatypes.ts";
import {getStudentCourse, deleteStudentCourse} from "../../services/StudentCourseApi.ts";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal.tsx";
import { Link } from "react-router-dom";

const AllocateStudentCourse = () =>{
    const[allocation, setAllocation] = useState<StudentCourse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(()=>{
    const fetchAllocated = async()=>{
        try{
            const res = await getStudentCourse();
        setAllocation(res.data);
        }catch(error){
            console.error("Error Fetching Data", error);
        }finally{
            setLoading(false);
        }
    };
    fetchAllocated();
  },[]);

  const handleDelete = (id: number)=>{
    setSelectedId(id);
    setOpenModal(true);
  };

  const confirmDelete = async()=>{
    if(!selectedId) return;
    try{
        await deleteStudentCourse(selectedId);
    toast.success("Deleted SuccessFully");
    setAllocation((prev)=>
        prev.filter((allocation) => allocation.id !== selectedId)
    );
    }catch(error){
        console.error("Error deleting allocation", error);
    }finally{
        setOpenModal(false);
        setSelectedId(null);
    }
  };

  return(
    <div className="student-management-container">
      <div className="management-header">
        <h2>Student-Course Allocation Management</h2>
        <Link to="/studentcourse/add" className="create-btn">
          + Allocate New
        </Link>
      </div>
      <div className="table-container">
        {loading ? (
          <p>Loading Allocated Student-Course matrices...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Course Name</th>
                <th>Action Rows</th>
              </tr>
            </thead>
            <tbody>
              {allocation.length > 0 ? (
                allocation.map((data) => {
                  const recordId =
                    data.id ?? `fallback-${data.student_id}-${data.course_id}`;

                  return (
                    <tr key={recordId}>
                      <td>{data.id ?? "N/A"}</td>
                      <td>{data.student_name ?? `Student ID: ${data.student_id}`}</td>
                      <td>
                        {data.course_name ?? `Course ID: ${data.course_id}`}
                      </td>
                      <td className="action-button">
                        <Link
                          to={`/studentcourse/edit/${data.id}`}
                          className="edit-btn"
                        >
                          Edit
                        </Link>
                        <button
                          className="delete-btn"
                          onClick={() => {
                            if (data.id) {
                              handleDelete(data.id);
                            } else {
                              alert(
                                "Cannot delete an item lacking a unique database record key.",
                              );
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
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      padding: "24px",
                      color: "#666",
                      fontStyle: "italic",
                    }}
                  >
                    No student-course allocations found. Click "+ Allocate New" to create
                    one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
  )
};

export default AllocateStudentCourse;