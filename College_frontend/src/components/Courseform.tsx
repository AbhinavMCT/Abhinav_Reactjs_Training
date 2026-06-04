import { CoursePayload, DepartmentOption } from "../types/Datatypes.ts";
import "../styles/course/AddCourse.css";

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
};

const CourseForm = ({
  formData,
  departments,
    loadingDepartments,
    handleChange,
    handleSubmit,
    buttonText,
    title,
}: Props) => {
  return (
    <div className="register-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>{title}</h2>

        <input
          type="text"
          name="name"
          placeholder="Course Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="dep_id"
          value={formData.dep_id}
          onChange={handleChange}
          required
          disabled={loadingDepartments}
        >
          <option value="">
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

        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
};
  export default CourseForm;