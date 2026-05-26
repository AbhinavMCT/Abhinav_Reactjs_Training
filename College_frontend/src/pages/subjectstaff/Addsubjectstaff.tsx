import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createSubjectStaff } from "../../services/SubjectStaffApi.ts";
import { getAllSubjects } from "../../services/SubjectApi.ts";
import {
  SubjectStaffPayload,
  SubjectItem,
  StaffItem,
} from "../../types/Datatypes.ts";
import { getAllStaff } from "../../services/StaffApi.ts";
import "../../styles/subjectstaff/addsubjectstaff.css" 

const AddSubjectStaff = () => {
  const [formData, setFormData] = useState<SubjectStaffPayload>({
    subject_id: 0,
    staff_id: 0,
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [staffList, setStaffList] = useState<StaffItem[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const response = await getAllSubjects();
        console.log(response);
        setSubjects(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
      }
    };

    loadSubjects();
  }, []);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const response = await getAllStaff();
        setStaffList(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadStaff();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createSubjectStaff(formData);
      navigate("/subject-staff");
    } catch (error) {
      console.error("Error adding subject staff:", error);
      alert("Failed to save assignment. Please verify inputs.");
    }
  };

  return (
         
      <div className="form-container">
        <div className="form-header">
          <h2>Add Subject Staff Allocation</h2>
          <p>Assign an active staff educator to an operational subject track.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject_id">Select Subject</label>
            <select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose Subject --</option>
              
              {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="staff_id">Select Staff Member</label>
            <select
              name="staff_id"
              value={formData.staff_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose Staff Member --</option>
              
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={() => navigate("/subjectstaff")}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-submit">
              Add Subject Staff
            </button>
          </div>
        </form>
      </div>
  );
};

export default AddSubjectStaff;