import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getSubjectById, updateSubject } from "../../services/SubjectApi.ts";

import { SubjectPayload } from "../../types/Datatypes.ts";

const EditSubject = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<SubjectPayload>({
    name: "",
    type: "",
    course_id: 0,
  });

  useEffect(() => {
    const loadSubject = async () => {
      try {
        if (!id) return;

        const response = await getSubjectById(Number(id));

        setFormData(response.data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    loadSubject();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "course_id" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!id) return;

      await updateSubject(Number(id), formData);

      alert("Subject updated successfully");

      navigate("/subject/management");
    } catch (error) {
      console.error(error);
      alert("Failed to update subject");
    }
  };

  return (
    <div className="register-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Edit Subject</h2>

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

        <input
          type="number"
          name="course_id"
          placeholder="Course ID"
          value={formData.course_id}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Subject</button>
      </form>
    </div>
  );
};

export default EditSubject;
