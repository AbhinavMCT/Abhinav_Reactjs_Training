import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/student/studentManagement.css";
import { RegisterPayload } from "../../types/Datatypes.ts";
import { deleteStaff, getAllStaff } from "../../services/StaffApi.ts";

const StaffManagement = () => {
  const [staff, setStaff] = useState<RegisterPayload[]>([]);
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadStaff = async () => {
        try {
          const response = await getAllStaff();
  
          setStaff(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      loadStaff();
    }, []);
  
    const handleDelete = async (id: number) => {
      if (!globalThis.confirm("Are you sure you want to delete this staff member?")) {
        return;
      }
      try {
        await deleteStaff(id);
        setStaff(
          staff.filter((employee) => {
            const employeeInfo = employee?.userData || employee;
            return employeeInfo?.id !== id;
          }),
        );
      } catch (error) {
        console.error("Error deleting staff:", error);
      }
    };
  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Staff Management</h2>

        <Link to="/staff/register" className="create-btn">
          + Create Staff
        </Link>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading staff...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>City</th>
                <th>District</th>
                <th>State</th>
                <th>Pin</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((employee, index) => {
                const employeeInfo = employee?.userData || employee;
                const addressInfo = employee?.addressData || employee;

                const rowKey = `employee-${employeeInfo?.id || "new"}-${index}`;

                return (
                  <tr key={rowKey}>
                    <td>{employeeInfo?.name ?? "N/A"}</td>
                    <td>{employeeInfo?.email ?? "N/A"}</td>
                    <td>{employeeInfo?.contact ?? "N/A"}</td>
                    <td>{employeeInfo?.DOB ?? "N/A"}</td>
                    <td>{employeeInfo?.gender ?? "N/A"}</td>

                    <td>{addressInfo?.city ?? "N/A"}</td>
                    <td>{addressInfo?.district ?? "N/A"}</td>
                    <td>{addressInfo?.state ?? "N/A"}</td>
                    <td>{addressInfo?.pin ?? "N/A"}</td>

                    <td className="action-buttons">
                      {employeeInfo?.id && (
                        <Link
                          to={`/staff/edit/${employeeInfo.id}`}
                          className="edit-btn"
                        >
                          Edit
                        </Link>
                      )}
                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (employeeInfo?.id) {
                            handleDelete(employeeInfo.id);
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
    </div>
  );
}

export default StaffManagement;