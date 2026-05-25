import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  SubjectStaffPayload,
  SubjectItem,
  StaffItem,
} from "../../types/Datatypes.ts";

import { getAllSubjects } from "../../services/SubjectApi.ts";
import { getAllStaff } from "../../services/StaffApi.ts";

import {
  updateSubjectStaff,
  getSubjectStaffById,
} from "../../services/SubjectStaffApi.ts";

import "../../styles/subjectstaff/addsubjectstaff.css";

const EditSubjectStaff = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<SubjectStaffPayload>({
    subject_id: 0,
    staff_id: 0,
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [staffList, setStaffList] = useState<StaffItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;

        const [dataRes, subjectRes, staffRes] = await Promise.all([
          getSubjectStaffById(Number(id)),
          getAllSubjects(),
          getAllStaff(),
        ]);

        console.log(dataRes.data);

        setFormData(dataRes.data[0]);

        setSubjects(
          Array.isArray(subjectRes.data)
            ? subjectRes.data
            : JSON.parse(subjectRes.data)
        );

        setStaffList(
          Array.isArray(staffRes.data)
            ? staffRes.data
            : JSON.parse(staffRes.data)
        );

      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "staff_id" || name === "subject_id"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!id) return;

    try {
      await updateSubjectStaff(Number(id), formData);

      alert("Updated Successfully");

      navigate("/subject-staff");

    } catch (error) {
      console.error(error);

      alert("Failed to Update");
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Edit Subject Staff Allocation</h2>

        <p>
          Update the assigned staff educator and subject mapping.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject_id">
            Select Subject
          </label>

          <select
            id="subject_id"
            name="subject_id"
            value={formData.subject_id}
            onChange={handleChange}
            required
          >
            <option value="">
              -- Choose Subject --
            </option>

            {subjects.map((sub) => (
              <option
                key={sub.id}
                value={sub.id}
              >
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="staff_id">
            Select Staff Member
          </label>

          <select
            id="staff_id"
            name="staff_id"
            value={formData.staff_id}
            onChange={handleChange}
            required
          >
            <option value="">
              -- Choose Staff Member --
            </option>

            {staffList.map((staff) => (
              <option
                key={staff.id}
                value={staff.id}
              >
                {staff.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate("/subject-staff")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-submit"
          >
            Update Subject Staff
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSubjectStaff;