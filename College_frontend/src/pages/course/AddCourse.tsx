import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  createCourse,
  getAllDepartments,
} from "../../services/CourseApi.ts";

import {
  CoursePayload,
  DepartmentOption,
} from "../../types/Datatypes.ts";

const AddCourse = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] =
    useState<DepartmentOption[]>([]);

  const [formData, setFormData] =
    useState<CoursePayload>({
      name: "",
      dep_id: 0,
    });

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response =
          await getAllDepartments();

        setDepartments(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadDepartments();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "dep_id"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await createCourse(formData);

      alert("Course created successfully");

      navigate("/course/management");
    } catch (error) {
      console.error(error);
      alert("Failed to create course");
    }
  };

  return (
    <div className="register-container">
      <form
        className="student-form"
        onSubmit={handleSubmit}
      >
        <h2>Create Course</h2>

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
          <option value="">
            Select Department
          </option>

          {departments.map((dep) => (
            <option
              key={dep.id}
              value={dep.id}
            >
              {dep.name}
            </option>
          ))}
        </select>

        <button type="submit">
          Create Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;