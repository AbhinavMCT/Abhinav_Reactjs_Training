import { useState } from "react";
import { createDepartment } from "../../services/DepartmentApi.ts";
import { Department } from "../../types/Datatypes.ts";

import "../../styles/department/AddDepartment.css"; 

const AddDepartment = () => {
  const [formData, setFormData] = useState<Department>({
    name: "",
    type: "",
    office_location: "",
    established_year: new Date().getFullYear(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "established_year" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createDepartment(formData);
      alert("Department added successfully");

      setFormData({
        name: "",
        type: "",
        office_location: "",
        established_year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error("Failed to add department record entry:", error);
    }
  };

  return (
    <div className="form-card-container">
      <h2>Add Department</h2>

      <form onSubmit={handleSubmit} className="department-form-stack">
        
        <div className="form-input-group">
          <label htmlFor="name">Department Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Department Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-input-group">
          <label htmlFor="type">Department Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Department Type</option>
            <option value="Science">Science</option>
            <option value="Arts">Arts</option>
            <option value="Commerce">Commerce</option>
          </select>
        </div>

        <div className="form-input-group">
          <label htmlFor="office_location">Office Location</label>
          <input
            id="office_location"
            type="text"
            name="office_location"
            placeholder="Office Location"
            value={formData.office_location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-input-group">
          <label htmlFor="established_year">Established Year</label>
          <input
            id="established_year"
            type="number" 
            name="established_year"
            placeholder="Year"
            value={formData.established_year || ""}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-submit-primary">
          Add Department
        </button>
        
      </form>
    </div>
  );
};

export default AddDepartment;