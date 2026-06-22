import { Exam,CourseOption } from "../types/Datatypes.ts";
import "../styles/exam/ExamForm.css";



type Props = {
  formData: Exam;
  courses: CourseOption[];
  loadingCourses: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  buttonText: string;
  errors: {
  name: string;
  semester: string;
  exam_date: string;
  course_id: string;
  exam_type: string;
  total_mark: string;
};
  title: string;
};

const Examform = ({
  formData,
  courses,
  loadingCourses,
  handleChange,
  handleSubmit,
  buttonText,
  errors,
  title,
}: Props) => {
  return (
    <div className="exam-container">
      <form className="exam-form" onSubmit={handleSubmit}>
        <h2>{title}</h2>
        <label htmlFor="name">Exam Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
        <label htmlFor="exam_type">Exam Type</label>
<select
  id="exam_type"
  name="exam_type"
  value={formData.exam_type}
  onChange={handleChange}
>
  <option value="">Select Exam Type</option>
  <option value="Internal">Internal</option>
  <option value="Assignment">Assignment</option>
  <option value="Lab">Lab</option>
  <option value="External">External</option>
</select>

{errors.exam_type && (
  <span className="error">{errors.exam_type}</span>
)}
        <label htmlFor="semester">Semester</label>
        <input
          id="semester"
          type="number"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
        />
        {errors.semester && <span className="error">{errors.semester}</span>}

        <label htmlFor="exam_date">Exam Date</label>
        <input
          id="exam_date"
          type="date"
          name="exam_date"
          value={formData.exam_date}
          onChange={handleChange}
        />
        {errors.exam_date && <span className="error">{errors.exam_date}</span>}
        <label htmlFor="total_mark">Total Mark</label>
<input
  id="total_mark"
  type="number"
  name="total_mark"
  value={formData.total_mark}
  onChange={handleChange}
/>

{errors.total_mark && (
  <span className="error">{errors.total_mark}</span>
)}
        <label htmlFor="course_id">Course</label>
        <select
          id="course_id"
          name="course_id"
          value={formData.course_id}
          onChange={handleChange}
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
        {errors.course_id && <span className="error">{errors.course_id}</span>}

        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
};

export default Examform;
