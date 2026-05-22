import { useState } from "react";

import {registerStudent} from "../../services/StudentApi.ts";

import {ProfileData,RegisterPayload} from "../../types/Datatypes.ts";

import "../../styles/student/register.css";

const RegisterStudent = () => {

  const [formData, setFormData] =
    useState<ProfileData>({
      name: "",
      email: "",
      contact: "",
      gender: "",
      DOB: "",

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

  const [loading, setLoading] =
    useState(false);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    setFormData((prev: ProfileData) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };



  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData((prev: ProfileData) => ({
      ...prev,

      address: {
        ...prev.address,

        [e.target.name]:
          e.target.name === "pin"
            ? Number(e.target.value)
            : e.target.value,
      },
    }));

  };

  

  const handleLoginChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  setFormData((prev: ProfileData) => ({
    ...prev,

    login: {
      ...prev.login,
      [e.target.name]: e.target.value,
    },
  }));

};

  

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      const payload:
        RegisterPayload = {

        loginData: {
          username:
            formData.login.username,

          password:
            formData.login.password,

          role_id: 3,
        },

        addressData: {
          city: formData.address.city,
          district:
            formData.address.district,
          state: formData.address.state,
          pin: formData.address.pin,
        },

        userData: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
          gender: formData.gender,
          DOB: formData.DOB,
        },
      };

      const res =
        await registerStudent(payload);

      alert(res.data.message);

      console.log(res.data);

    } catch (error) {

      console.error(
        "Registration Failed:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="register-container">

      <form
        className="student-form"
        onSubmit={handleSubmit}
      >

        <h2>Register Student</h2>

        

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Gender
          </option>

          <option value="male">
            Male
          </option>

          <option value="female">
            Female
          </option>
        </select>

        <input
          type="date"
          name="DOB"
          value={formData.DOB}
          onChange={handleChange}
          required
        />

        

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.address.city}
          onChange={handleAddressChange}
          required
        />

        <input
          type="text"
          name="district"
          placeholder="District"
          value={formData.address.district}
          onChange={handleAddressChange}
          required
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.address.state}
          onChange={handleAddressChange}
          required
        />

        <input
          type="text"
          name="pin"
          placeholder="Pin"
          value={formData.address.pin}
          onChange={handleAddressChange}
          required
        />

        

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.login.username}
          onChange={handleLoginChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.login.password}
          onChange={handleLoginChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {
            loading
              ? "Registering..."
              : "Register Student"
          }
        </button>

      </form>

    </div>
  );
};

export default RegisterStudent;