import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById, updateExam } from "../../services/ExamApi.ts";
import { ExamPayload } from "../../types/Datatypes.ts";
import { getAllCourses } from "../../services/CourseApi.ts";

interface CourseOption {
  id: number;
  name: string;
}

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [loadingExam, setLoadingExam] = useState<boolean>(true); // Added to track primary record loading
  
  const [formData, setFormData] = useState<ExamPayload>({
    name: "",
    semester: 1,
    exam_date: "",
    course_id: 0,
  });

  // 🛠️ Combined data fetching into an optimal async workflow to resolve linting warnings
  useEffect(() => {
    const loadInitData = async () => {
      try {
        if (!id) return;
        
        // Fetch exam records and course arrays concurrently for better performance
        const [examRes, courseRes] = await Promise.all([
          getExamById(Number(id)),
          getAllCourses()
        ]);

        // Safely pull the first item from the row array payload
        if (examRes.data && examRes.data.length > 0) {
          setFormData(examRes.data[0]);
        }
        
        setCourses(courseRes.data);
      } catch (error) {
        console.error("Failed to populate initial edit data matrix:", error);
      } finally {
        setLoadingCourses(false);
        setLoadingExam(false);
      }
    };

    loadInitData();
  }, [id]);

  // 🛠️ Fixed: Extended the parameter type definition to accept HTMLSelectElement
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "semester" || e.target.name === "course_id"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.course_id === 0) {
      alert("Please assign a valid course.");
      return;
    }

    try {
      if (!id) return;
      await updateExam(Number(id), formData);
      alert("Exam updated successfully");
      navigate("/exam/management");
    } catch (error) {
      console.error(error);
      alert("Failed to update exam");
    }
  };

  if (loadingExam) {
    return <div className="register-container"><p>Loading exam records...</p></div>;
  }

  return (
    <div className="register-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Edit Exam</h2>

        <input
          type="text"
          name="name"
          placeholder="Exam Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="semester"
          placeholder="Semester"
          value={formData.semester}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="exam_date"
          // 🛠️ Fixed: Added a solid string fallback to keep input controlled at all times
          value={formData.exam_date ? formData.exam_date.split("T")[0] : ""}
          onChange={handleChange}
          required
        />

        <select
          name="course_id"
          value={formData.course_id || ""}
          onChange={handleChange}
          required
          disabled={loadingCourses}
        >
          <option value="">
            {loadingCourses ? "Loading courses..." : "Select Course"}
          </option>

          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <button type="submit">
          Update Exam
        </button>
      </form>
    </div>
  );
};

export default EditExam;