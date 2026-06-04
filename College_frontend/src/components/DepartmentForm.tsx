import { Department } from "../types/Datatypes.ts";
import "../styles/department/AddDepartment.css";

type Props = {
  formData: Department;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;

  handleSubmit: (
    e: React.SubmitEvent<HTMLFormElement>
  ) => void;

  buttonText: string;
};

const DepartmentForm = ({
  formData,
  handleChange,
  handleSubmit,
  buttonText,
}: Props) => {
  return (

    <div className="form-card-container">

      <form
        onSubmit={handleSubmit}
        className="department-form-stack"
      >

        <div className="form-input-group">
          <label htmlFor="name">
            Department Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter Department Name"
            value={formData.name || ""}
            onChange={handleChange}
          />
        </div>

        

        <div className="form-input-group">

          <label htmlFor="type">
            Department Type
          </label>

          <select
            id="type"
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
          >
            <option value="">
              Select Department Type
            </option>

            <option value="Academic">
              Academic
            </option>

<option value="Accounts">
              Accounts
            </option>

            <option value="Administrative">
              Administrative
            </option>

            

          </select>
        </div>

        

        <div className="form-input-group">

          <label htmlFor="office_location">
            Office Location
          </label>

          <input
            id="office_location"
            type="text"
            name="office_location"
            placeholder="Enter Office Location"
            value={formData.office_location || ""}
            onChange={handleChange}
          />
        </div>

      

        <div className="form-input-group">

          <label htmlFor="established_year">
            Established Year
          </label>

          <input
            id="established_year"
            type="number"
            name="established_year"
            placeholder="Enter Established Year"
            value={formData.established_year || ""}
            onChange={handleChange}
          />
        </div>

        

        <button
          type="submit"
          className="btn-submit-primary"
        >
          {buttonText}
        </button>

      </form>

    </div>
  );
};

export default DepartmentForm;