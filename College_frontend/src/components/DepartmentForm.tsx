import { Department } from "../types/Datatypes.ts";
import "../styles/department/AddDepartment.css";
import Breadcrumbs from "./Breadcrumbs.tsx";

type Props = {
  formData: Department;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;

  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  errors: {
    name: string;
    type: string;
    office_location: string;
    established_year: string;
  };
  buttonText: string;
  title: string;
};

const DepartmentForm = ({
  formData,
  handleChange,
  handleSubmit,
  buttonText,
  title,
  errors,
}: Props) => {
  return (
    <div className="form-card-container">
      <form onSubmit={handleSubmit} className="department-form-stack">
        <Breadcrumbs />
        <h2>{title}</h2>
        <div className="form-input-group">
          <label htmlFor="name">Department Name</label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter Department Name"
            value={formData.name || ""}
            onChange={handleChange}
          />

          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-input-group">
          <label htmlFor="type">Department Type</label>

          <select
            id="type"
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
          >
            <option value="">Select Department Type</option>

            <option value="Academic">Academic</option>

            <option value="Accounts">Accounts</option>

            <option value="Administrative">Administrative</option>
          </select>
          {errors.type && <span className="error">{errors.type}</span>}
        </div>

        <div className="form-input-group">
          <label htmlFor="office_location">Office Location</label>

          <input
            id="office_location"
            type="text"
            name="office_location"
            placeholder="Enter Office Location"
            value={formData.office_location || ""}
            onChange={handleChange}
          />
          {errors.office_location && (
            <span className="error">{errors.office_location}</span>
          )}
        </div>

        <div className="form-input-group">
          <label htmlFor="established_year">Established Year</label>

          <input
            id="established_year"
            type="number"
            name="established_year"
            placeholder="Enter Established Year"
            value={formData.established_year || ""}
            onChange={handleChange}
          />
          {errors.established_year && (
            <span className="error">{errors.established_year}</span>
          )}
        </div>

        <button type="submit" className="btn-submit-primary">
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default DepartmentForm;
