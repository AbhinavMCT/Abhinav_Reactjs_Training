import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSubject } from "../../services/SubjectApi.ts";
import { getAllCourses } from "../../services/CourseApi.ts";
import { SubjectPayload } from "../../types/Datatypes.ts";

interface CourseOption {
  id: number;
  name: string;
}

const AddSubject = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);

  const [formData, setFormData] = useState<SubjectPayload>({
    name: "",
    type: "",
    course_id: 0,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses();
        
        const dataPayload = response?.data;
        const finalArray = Array.isArray(dataPayload) 
          ? dataPayload 
          : (dataPayload?.data || response);

        if (Array.isArray(finalArray)) {
          setCourses(finalArray);
        } else {
          console.error("Course listings API response did not yield an array structure:", dataPayload);
          setCourses([]);
        }
      } catch (error) {
        console.error("Failed to load course listings:", error);
        setCourses([]);
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
        e.target.name === "course_id" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.course_id === 0) {
      alert("Please select a valid course allocation.");
      return;
    }

    try {
      await createSubject(formData);
      alert("Subject created successfully");
      navigate("/subject-management");
    } catch (error) {
      console.error("Subject insertion failure:", error);
      alert("Failed to create subject");
    }
  };

  return (
    <div className="register-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Create Subject</h2>

        <input
          type="text"
          name="name"
          placeholder="Subject Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Subject Type</option>
          <option value="Core">Core</option>
          <option value="Elective">Elective</option>
          <option value="Lab">Lab</option>
        </select>

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

        <button type="submit">Create Subject</button>
      </form>
    </div>
  );
};

export default AddSubject;