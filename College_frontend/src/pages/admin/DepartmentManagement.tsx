import { useEffect, useState } from "react";
import { deleteDepartment, getDepartments } from "../../services/DepartmentApi.ts";
import { Department } from "../../types/Datatypes.ts";
import { Link } from "react-router-dom";

import "../../styles/department/DepartmentManagement.css";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal.tsx";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

   const [openModal, setOpenModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments();

        const finalArray = response.data || response;

        setDepartments(Array.isArray(finalArray) ? finalArray : []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleDelete =  (id: number) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const confirmDelete = async() =>{
    if(!selectedId) return;

    try{
      await deleteDepartment(selectedId);
      toast.success("Deleted SuccessFully");

      setDepartments((prev)=>
        prev.filter((dep)=>{
          return dep.id !== selectedId
        })
      );
    }catch(error){
      console.error("Error in Deleting", error);
    }finally{
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

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>Department Management</h1>

        <Link
          to="/departments/add"
          className="btn-create-link"
        >
          + Create Department
        </Link>
      </div>

      <div className="table-viewport-card">
        <table className="management-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Office Location</th>
              <th>Established Year</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.length > 0 ? (
              departments.map((department, index) => (
                <tr key={department.id ?? index}>
                  <td>{department.id}</td>

                  <td className="department-name-emphasis">
                    {department.name}
                  </td>

                  <td>{department.type}</td>

                  <td>{department.office_location}</td>

                  <td>{department.established_year}</td>

                  <td>
                    <div className="row-action-group">
                      <Link
                        to={`/departments/edit/${department.id}`}
                        className="btn-action-edit"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>{
                          if(department.id){
                            handleDelete(department.id);
                          }
                        }}
                        
                          
                        className="btn-action-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="empty-row-fallback"
                >
                  No Departments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default DepartmentManagement;