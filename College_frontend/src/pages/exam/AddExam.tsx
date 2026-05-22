import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createExam } from "../../services/ExamApi.ts";
import { getAllCourses } from "../../services/CourseApi.ts";

import { ExamPayload } from "../../types/Datatypes.ts";

interface CourseOption {
  id: number;
  name: string;
}

const AddExam = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);

  const [formData, setFormData] = useState<ExamPayload>({
    name: "",
    semester: 1,
    exam_date: "",
    course_id: 0,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses();
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to load course listings:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "semester" || e.target.name === "course_id"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.course_id === 0) {
      alert("Please select a valid course.");
      return;
    }

    try {
      await createExam(formData);
      alert("Exam created successfully");
      navigate("/exam-management");
    } catch (error) {
      console.error(error);
      alert("Failed to create exam");
    }
  };

  return (
    <div className="register-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Create Exam</h2>

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
            {loadingCourses ? "Loading courses..." : "Select Course"}
          </option>

          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loadingCourses}>
          Create Exam
        </button>
      </form>
    </div>
  );
};

export default AddExam;
