import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { getStudentById, updateStudents } from "../../services/StudentApi.ts";

import { ProfileData, UpdateProfilePayload } from "../../types/Datatypes.ts";

import "../../styles/student/editStudent.css";

const EditStudent = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    email: "",
    contact: "",
    gender: "",
    DOB: "",
    address_id: undefined, 

    address: {
      city: "",
      district: "",
      state: "",
      pin: 0,
    },

    login: {
      username: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await getStudentById(Number(id));

        setFormData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev: ProfileData) => ({
      ...prev,

      [e.target.name]: e.target.value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: ProfileData) => ({
      ...prev,

      address: {
        ...prev.address,

        [e.target.name]:
          e.target.name === "pin" ? Number(e.target.value) : e.target.value,
      },
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload: UpdateProfilePayload = {
        userData: {
          name: formData.name || "",
          email: formData.email || "",
          contact: formData.contact || "",
          gender: formData.gender || "",
          DOB: formData.DOB || "",
          address_id: formData.address_id ?? undefined,
        },

        addressData: {
          city: formData.address.city || "",
          district: formData.address.district || "",
          state: formData.address.state || "",
          pin: formData.address.pin || 0,
        },
      };

    const res = await updateStudents(Number(id), payload);
    alert(res.data.message);
    navigate("/student-management");
  } catch (error) {
    console.error("Submission operational failure:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="edit-profile-container">
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <h2>Edit Student</h2>

        <div className="section-title">Student Information</div>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={formData.contact}
          onChange={handleChange}
        />

        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>

          <option value="male">Male</option>

          <option value="female">Female</option>
        </select>

        <input
          type="date"
          name="DOB"
          value={formData.DOB}
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.address.city}
          onChange={handleAddressChange}
        />

        <input
          type="text"
          name="district"
          placeholder="District"
          value={formData.address.district}
          onChange={handleAddressChange}
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.address.state}
          onChange={handleAddressChange}
        />

        <input
          type="number"
          name="pin"
          placeholder="Pin"
          value={formData.address.pin}
          onChange={handleAddressChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Student"}
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
