import { Assignment, SubjectItem } from "../types/Datatypes.ts";
import "../styles/assignment/assignmentform.css";
import Breadcrumbs from "./Breadcrumbs.tsx";

type Props = {
  assignment: Assignment;
  subjects: SubjectItem[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  errors: {
    assignment_name: string;
    description: string;
    subject_id: string;
    start_date: string;
    end_date: string;
  };
  buttonText: string;
  title: string;
};

const AssignmentForm = ({
  assignment,
  subjects,
  handleChange,
  handleSubmit,
  errors,
  buttonText,
  title,
}: Props) => {
  return (
    <div className="assignment-form-container">
      <div className="assignment-form-card">
        <Breadcrumbs />
        <h2>{title}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="assignment_name">Assignment Name:</label>
            <input
              type="text"
              name="assignment_name"
              value={assignment.assignment_name}
              onChange={handleChange}
              required
            />

            {errors.assignment_name && (
              <span className="error-text">{errors.assignment_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>

            <input
              type="text"
              name="description"
              value={assignment.description}
              onChange={handleChange}
              required
            />

            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="subject_id">Subject:</label>

            <select
              name="subject_id"
              value={assignment.subject_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Subject</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            {errors.subject_id && (
              <span className="error-text">{errors.subject_id}</span>
            )}
          </div>

          <div className="date-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>

              <input
                type="date"
                name="start_date"
                value={assignment.start_date}
                onChange={handleChange}
                required
              />

              {errors.start_date && (
                <span className="error-text">{errors.start_date}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date</label>

              <input
                type="date"
                name="end_date"
                value={assignment.end_date}
                onChange={handleChange}
                required
              />
              {errors.end_date && (
                <span className="error-text">{errors.end_date}</span>
              )}
            </div>
          </div>

          <button type="submit" className="assignment-btn">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;
