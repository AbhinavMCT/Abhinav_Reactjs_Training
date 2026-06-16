import { CoursePayload, DepartmentOption } from "../types/Datatypes.ts";
import "../styles/course/AddCourse.css";
import Breadcrumbs from "./Breadcrumbs.tsx";

type Props = {
  formData: CoursePayload;
  departments: DepartmentOption[];
  loadingDepartments: boolean;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;

  handleSubmit: (
    e: React.SubmitEvent<HTMLFormElement>
  ) => void;

  buttonText: string;
  title: string;

  errors: {
    name: string;
    dep_id: string;
  };
};

const CourseForm = ({
  formData,
  departments,
  loadingDepartments,
  handleChange,
  handleSubmit,
  buttonText,
  title,
  errors,
}: Props) => {
  return (
    <div className="register-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>{title}</h2>

        <div className="form-group">
          <label htmlFor="name">Course Name</label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Course Name"
            value={formData.name}
            onChange={handleChange}
          />

          {errors.name && (
            <span className="error">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dep_id">Department</label>

          <select
            id="dep_id"
            name="dep_id"
            value={formData.dep_id}
            onChange={handleChange}
            disabled={loadingDepartments}
          >
            <option value={0}>
              {loadingDepartments
                ? "Loading Departments..."
                : "Select Department"}
            </option>

            {departments.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>

          {errors.dep_id && (
            <span className="error">
              {errors.dep_id}
            </span>
          )}
        </div>

        <button type="submit">
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default CourseForm;