import { useNavigate } from "react-router-dom";
import {
  Marks,
  SubjectItem,
  Studentlist,
  Examlist,
} from "../types/Datatypes.ts";
import "../styles/mark/MarkForm.css";
import Breadcrumbs from "./Breadcrumbs.tsx";

type Props = {
  formData: Marks;
  subjects: SubjectItem[];
  students: Studentlist[];
  exams: Examlist[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  buttonText: string;
  title: string;
  errors: {
    student_id: string;
    subject_id: string;
    exam_id: string;
    mark: string;
    grade: string;
  };
};

const MarkForm = ({
  formData,
  subjects,
  students,
  exams,
  handleChange,
  handleSubmit,
  buttonText,
  title,
  errors,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div className="mark-container">
      <div className="mark-card">
        <Breadcrumbs />
        <div className="mark-header">
  <h2>{title}</h2>
  <p>Record and manage student examination marks</p>
</div>

        <form onSubmit={handleSubmit} className="mark-form">
          <div className="form-group">
            <label htmlFor="student_id">Student</label>
            <select
              id="student_id"
              name="student_id"
              value={formData.student_id || ""}
              onChange={handleChange}
            >
              <option value="">Choose Student</option>

              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>

            {errors.student_id && (
              <span className="error">{errors.student_id}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="subject_id">Subject</label>

            <select
              id="subject_id"
              name="subject_id"
              value={formData.subject_id || ""}
              onChange={handleChange}
            >
              <option value="">Choose Subject</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            {errors.subject_id && (
              <span className="error">{errors.subject_id}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="exam_id">Exam</label>

            <select
              id="exam_id"
              name="exam_id"
              value={formData.exam_id || ""}
              onChange={handleChange}
            >
              <option value="">Choose Exam</option>

              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>

            {errors.exam_id && (
              <span className="error">{errors.exam_id}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mark">Mark Obtained</label>

            <input
              id="mark"
              name="mark"
              type="number"
              min="0"
              value={formData.mark || ""}
              onChange={handleChange}
              placeholder="Enter Mark"
            />

            {errors.mark && (
              <span className="error">{errors.mark}</span>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="grade">Grade</label>

            <input
              id="grade"
              name="grade"
              type="text"
              value={formData.grade}
              readOnly
              placeholder="Grade will be calculated automatically"
            />

            {errors.grade && (
              <span className="error">{errors.grade}</span>
            )}
          </div>

          <div className="button-group">
            <button type="submit" className="btn-submit">
              {buttonText}
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/staff-home")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkForm;