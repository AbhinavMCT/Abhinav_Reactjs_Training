import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { registerStaff } from "../services/StaffApi.ts";
import { ProfileData, RegisterPayload } from "../types/Datatypes.ts";

import "../styles/register.css";
import { toast } from "react-toastify";
import ProfileForm from "../components/ProfileForm.tsx";
import { registerStudent } from "../services/StudentApi.ts";
import Breadcrumbs from "../components/Breadcrumbs.tsx";

const RegisterStaff = () => {
  const location = useLocation();

  const isStaff = location.pathname.includes("staff");
  const api = isStaff ? registerStaff : registerStudent;

  const message = isStaff ? "Added Successfully" : "Created Successfully";
  const redirect = isStaff ? "/staff-management" : "/student-management";

  const title = isStaff ? "Register Staff" : "Register Student";

  const buttonText = isStaff ? "Add Staff" : "Add Student";
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileData>({
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

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contact: "",
    gender: "",
    DOB: "",
    city: "",
    district: "",
    state: "",
    pin: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const validateName = (name: string) => {
    if (!name.trim()) return "Name is required";
    if (name.length < 3) return "Minimum 3 characters required";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return "Invalid email address";
    }
    return "";
  };

  const validateContact = (contact: string) => {
    if (!contact.trim()) return "Contact is required";
    if (!/^\d{10}$/.test(contact)) {
      return "Contact must be 10 digits";
    }
    return "";
  };

  const validatePin = (pin: number) => {
    if (!pin) return "PIN is required";
    if (!/^\d{6}$/.test(String(pin))) {
      return "PIN must be 6 digits";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) return "Password is required";

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password,
      )
    ) {
      return "Password must contain uppercase, lowercase, number, special character and minimum 8 characters";
    }

    return "";
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      contact: validateContact(formData.contact),
      gender: formData.gender ? "" : "Please select gender",
      DOB: formData.DOB ? "" : "Date of birth is required",
      city: formData.address.city.trim() ? "" : "City is required",
      district: formData.address.district.trim() ? "" : "District is required",
      state: formData.address.state.trim() ? "" : "State is required",
      pin: validatePin(formData.address.pin),
      username: formData.login.username.trim() ? "" : "Username is required",
      password: validatePassword(formData.login.password),
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

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

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: ProfileData) => ({
      ...prev,

      login: {
        ...prev.login,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    console.log(validateForm());

    setLoading(true);

    try {
      const payload: RegisterPayload = {
        loginData: {
          username: formData.login.username,

          password: formData.login.password,

          role_id: isStaff ? 2 : 3,
        },

        addressData: {
          city: formData.address.city,

          district: formData.address.district,

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
      const res = await api(payload);

      toast.success(res.data.message || message);

      navigate(redirect);
    } catch (error: any) {
      console.error(error);

      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumbs />
      <ProfileForm
        title={title}
        formData={formData}
        loading={loading}
        buttonText={buttonText}
        showLoginFields={true}
        errors={errors}
        handleChange={handleChange}
        handleAddressChange={handleAddressChange}
        handleLoginChange={handleLoginChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default RegisterStaff;
