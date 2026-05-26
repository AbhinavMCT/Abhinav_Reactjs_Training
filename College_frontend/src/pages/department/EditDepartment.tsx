import { useState, useEffect } from "react";
import { getDepartmentById, updateDepartment } from "../../services/DepartmentApi.ts";
import { useNavigate, useParams } from "react-router-dom";
import { Department } from "../../types/Datatypes.ts";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Department>({
    name: "",
    type: "",
    office_location: "",
    established_year: 0,
  });

  useEffect(() => {
    const fetchDepartment = async () => {
      if (id) {
        try {
          const response = await getDepartmentById(Number(id));
          
          const deptData = response.data?.[0] || response.data || response;
          setFormData(deptData);
        } catch (error) {
          console.error("Error fetching department:", error);
        }
      }
    };

    fetchDepartment();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "established_year"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (id) {
        await updateDepartment(Number(id), formData);
        alert("Department updated successfully");
        navigate("/departments");
      }
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div> 
        <label htmlFor="name">Name:</label>
        <input
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          required    
        />
      </div>

      <div>
        <label htmlFor="type">Type:</label>
        <select 
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
      </div> {/* 🛠️ Fixed: Removed the loose, duplicated stray </div> that was crashing your layout compiler */}

      <div>
        <label htmlFor="office_location">Office Location:</label>
        <input
          type="text"
          name="office_location"
          placeholder="Office Location"
          value={formData.office_location}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="established_year">Established Year:</label>
        <input
          type="number" 
          name="established_year"
          placeholder="Established Year"
          value={formData.established_year || ""} 
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Update Department</button>
    </form>
  );
};

export default EditDepartment;