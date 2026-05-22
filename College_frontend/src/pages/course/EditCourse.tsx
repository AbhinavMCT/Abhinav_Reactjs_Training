import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  getCourseById,
  updateCourse,
  getAllDepartments,
} from "../../services/CourseApi.ts";

import { CoursePayload, DepartmentOption } from "../../types/Datatypes.ts";

const EditCourse = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  const [formData, setFormData] = useState<CoursePayload>({
    name: "",
    dep_id: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;

        const [courseRes, depRes] = await Promise.all([
          getCourseById(Number(id)),
          getAllDepartments(),
        ]);

        setFormData(courseRes.data[0]);

        setDepartments(depRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "dep_id" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!id) return;

      await updateCourse(Number(id), formData);

      alert("Course updated successfully");

      navigate("/course/management");
    } catch (error) {
      console.error(error);
      alert("Failed to update course");
    }
  };

  return (
    <div className="register-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Edit Course</h2>

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
        >
          <option value="">Select Department</option>

          {departments.map((dep) => (
            <option key={dep.id} value={dep.id}>
              {dep.name}
            </option>
          ))}
        </select>

        <button type="submit">Update Course</button>
      </form>
    </div>
  );
};

export default EditCourse;
