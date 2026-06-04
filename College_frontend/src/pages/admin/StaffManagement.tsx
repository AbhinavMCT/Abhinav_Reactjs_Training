import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import "../../styles/student/studentManagement.css";

import { RegisterPayload } from "../../types/Datatypes.ts";

import {
  deleteStaff,
  getAllStaff,
} from "../../services/StaffApi.ts";

import ConfirmModal from "../../components/ConfirmModal.tsx";
import { toast } from "react-toastify";

const StaffManagement = () => {

  const [staff, setStaff] =
    useState<RegisterPayload[]>([]);

  const [openModal, setOpenModal] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadStaff = async () => {

      try {

        const response =
          await getAllStaff();

        console.log(response.data);

        setStaff(response.data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

    loadStaff();

  }, []);

  const handleDeleteClick = (
    id: number
  ) => {

    setSelectedId(id);

    setOpenModal(true);
  };

  const confirmDelete = async () => {

    if (!selectedId) return;

    try {

      await deleteStaff(selectedId);
      toast.success("Deleted SuccessFully");

      setStaff(
        staff.filter((employee) => {

          const employeeInfo =
            employee?.userData || employee;

          return (
            employeeInfo?.id !== selectedId
          );
        }),
      );

    } catch (error) {

      console.error(
        "Error deleting staff:",
        error
      );

    } finally {

      setOpenModal(false);

      setSelectedId(null);
    }
  };

  return (

    <div className="student-management-container">

      <div className="management-header">

        <h2>
          Staff Management
        </h2>
        <div className="buttons">
          <Link to="/subject-staff" className="create-btn">Allocate Subject to Staff</Link>

        <Link
          to="/staff/register"
          className="create-btn"
        >
          + Create Staff
        </Link>

        </div>
      </div>

      <div className="table-container">

        {loading ? (

          <p>Loading staff...</p>

        ) : (

          <table>

            <thead>

              <tr>
                <th>ID</th>
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

              {staff.map(
                (employee, index) => {

                  const employeeInfo =
                    employee?.userData || employee;

                  const addressInfo =
                    employee?.addressData || employee;

                  const rowKey =
                    `employee-${
                      employeeInfo?.id || "new"
                    }-${index}`;

                  return (

                    <tr key={rowKey}>

                      <td>
                        {employeeInfo?.id}
                      </td>

                      <td>
                        {employeeInfo?.name ??
                          "N/A"}
                      </td>

                      <td>
                        {employeeInfo?.email ??
                          "N/A"}
                      </td>

                      <td>
                        {employeeInfo?.contact ??
                          "N/A"}
                      </td>

                      <td>
                        {employeeInfo?.DOB ??
                          "N/A"}
                      </td>

                      <td>
                        {employeeInfo?.gender ??
                          "N/A"}
                      </td>

                      <td>
                        {addressInfo?.city ??
                          "N/A"}
                      </td>

                      <td>
                        {addressInfo?.district ??
                          "N/A"}
                      </td>

                      <td>
                        {addressInfo?.state ??
                          "N/A"}
                      </td>

                      <td>
                        {addressInfo?.pin ??
                          "N/A"}
                      </td>

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

                            if (
                              employeeInfo?.id
                            ) {

                              handleDeleteClick(
                                employeeInfo.id
                              );
                            }
                          }}
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  );
                },
              )}

            </tbody>

          </table>
        )}

      </div>

      <ConfirmModal
        isOpen={openModal}
        title="Delete Staff"
        message="Are you sure you want to delete this staff?"
        onConfirm={confirmDelete}
        onCancel={() => {

          setOpenModal(false);

          setSelectedId(null);
        }}
      />

    </div>
  );
};

export default StaffManagement;