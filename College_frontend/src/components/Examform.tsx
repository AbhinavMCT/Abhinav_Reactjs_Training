import { Exam } from "../types/Datatypes.ts";
import "../styles/exam/ExamForm.css";

interface CourseOption {
  id: number;
  name: string;
}

type props = {
  formData: Exam;
  courses: CourseOption[];
  loadingCourses: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleSubmit: (
      e: React.SubmitEvent<HTMLFormElement>
    ) => void;
  buttonText: string;
  title: string;
};

const Examform = ({
  formData,
  courses,
  loadingCourses,
  handleChange,
  handleSubmit,
  buttonText,
  title,
}: props) => {
    return (
  <div className="exam-container">
    <form className="exam-form" onSubmit={handleSubmit}>
      <h2>{title}</h2>

      <input
        type="text"
        name="name"
        placeholder="Exam Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="semester"
        placeholder="Semester"
        value={formData.semester}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="exam_date"
        value={formData.exam_date}
        onChange={handleChange}
        required
      />

      <select
        name="course_id"
        value={formData.course_id}
        onChange={handleChange}
        required
        disabled={loadingCourses}
      >
        <option value="">
          {loadingCourses ? "Loading Courses..." : "Select Course"}
        </option>

        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>

      <button type="submit">{buttonText}</button>
    </form>
  </div>
);
};

export default Examform;
