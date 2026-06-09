import {
  SubjectStaffPayload,
  SubjectItem,
  StaffItem,
} from "../types/Datatypes.ts";
import { useNavigate } from "react-router-dom";
import "../styles/subjectstaff/addsubjectstaff.css";
import Breadcrumbs from "./Breadcrumbs.tsx";

type props = {
  formData: SubjectStaffPayload;
  subjects: SubjectItem[];
  staffList: StaffItem[];
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  buttonText: string;
  title: string;
};

const SubjectStaffForm = ({
  formData,
  subjects,
  staffList,
  handleChange,
  handleSubmit,
  buttonText,
  title,
}: props) => {
  const navigate = useNavigate();
  return (
    <div className="form-container">
      <Breadcrumbs />
      <div className="form-header">
        <h2>{title}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="staff_id">Select Staff Member</label>

          <select
            id="staff_id"
            name="staff_id"
            value={formData.staff_id}
            onChange={handleChange}
            required
          >
            <option value="">Choose Staff Member</option>

            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="subject_id">Select Subject</label>

          <select
            id="subject_id"
            name="subject_id"
            value={formData.subject_id}
            onChange={handleChange}
            required
          >
            <option value="">Choose Subject</option>

            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
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

          <button type="submit" className="btn btn-submit">
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubjectStaffForm;
