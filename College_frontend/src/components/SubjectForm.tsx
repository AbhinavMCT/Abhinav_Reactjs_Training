import { SubjectPayload } from "../types/Datatypes.ts";

interface CourseOption {
  id: number;
  name: string;
}

type Props = {
  formData: SubjectPayload;

  courses: CourseOption[];

  loadingCourses: boolean;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;

  handleSubmit: (
    e: React.SubmitEvent<HTMLFormElement>
  ) => void;

  buttonText: string;

  title: string;
};

const SubjectForm = ({
  formData,
  courses,
  loadingCourses,
  handleChange,
  handleSubmit,
  buttonText,
  title,
}: Props) => {
  return (
    <div className="form-card-container">

      <form
        className="department-form-stack"
        onSubmit={handleSubmit}
      >

        <h2>{title}</h2>


        <div className="form-input-group">

          <label htmlFor="name">
            Subject Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter Subject Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-input-group">

          <label htmlFor="type">
            Subject Type
          </label>

          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Subject Type
            </option>

            <option value="Core">
              Core
            </option>

            <option value="Elective">
              Elective
            </option>

            <option value="Lab">
              Lab
            </option>

          </select>
        </div>


        <div className="form-input-group">

          <label htmlFor="course_id">
            Course
          </label>

          <select
            id="course_id"
            name="course_id"
            value={formData.course_id || ""}
            onChange={handleChange}
            required
            disabled={loadingCourses}
          >

            <option value="">
              {loadingCourses
                ? "Loading courses..."
                : "Select Course"}
            </option>

            {courses.map((course) => (
              <option
                key={course.id}
                value={course.id}
              >
                {course.name}
              </option>
            ))}

          </select>
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

export default SubjectForm;