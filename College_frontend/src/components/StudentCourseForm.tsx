import {StudentCourse,Studentlist,Courselist} from "../types/Datatypes.ts";
import {useNavigate} from "react-router-dom";

type props = {
    formData: StudentCourse;
    students: Studentlist[];
    courses: Courselist[];
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>)=> void;
    handleSubmit: (e: React.SubmitEvent<HTMLFormElement>)=> void;
    buttonText: string;
    title: string;
}

const StudentCourseForm = ({
    formData,
    students,
    courses,
    handleChange,
    handleSubmit,
    buttonText,
    title
}: props)=>{

    const navigate = useNavigate();

    return(
        <div className="form-container">
      <div className="form-header">
        <h2>{title}</h2>

      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject_id">Select Subject</label>

          <select
            id="subject_id"
            name="subject_id"
            value={formData.student_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose Subject --</option>

            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="staff_id">Select Staff Member</label>

          <select
            id="staff_id"
            name="staff_id"
            value={formData.course_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Choose Staff Member --</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
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

export default StudentCourseForm;