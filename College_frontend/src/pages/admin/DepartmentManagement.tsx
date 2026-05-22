import { useEffect, useState } from "react";
import { deleteDepartment, getDepartments } from "../../services/DepartmentApi.ts";
import { Department } from "../../types/Datatypes.ts";
import { Link } from "react-router";

import "../../styles/department/DepartmentManagement.css"; 

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  

  useEffect(() => {
    const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      const finalArray = response.data || response;
      setDepartments(Array.isArray(finalArray) ? finalArray : []);
    } catch (error: unknown) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };
    fetchDepartments();
  }, []);

  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) return;
    
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await deleteDepartment(id);
      alert("Department deleted successfully");
      setDepartments((prev) => prev.filter((dept) => dept.id !== id));
    } catch (error: unknown) {
      console.error("Error deleting department:", error);
    }
  };

  if (loading) {
    return <div className="dashboard-loading-state">Loading departments matrix...</div>;
  }

  return (
    <div className="management-container">
      
      <div className="management-header">
        <h1>Department Management</h1>
        <Link to="/departments/add" className="btn-create-link">
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
                  <td className="department-name-emphasis">{department.name}</td>
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
                        onClick={() => handleDelete(department.id)} 
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
                <td colSpan={6} className="empty-row-fallback">
                  No Departments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default DepartmentManagement;