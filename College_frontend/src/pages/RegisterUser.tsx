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

  const validateForm = () => {
    const newErrors = {
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
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";

      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = "Minimum 3 characters required";

      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";

      isValid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";

      isValid = false;
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact is required";

      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact must be 10 digits";

      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender";

      isValid = false;
    }

    if (!formData.DOB) {
      newErrors.DOB = "Date of birth is required";

      isValid = false;
    }

    if (!formData.address.city.trim()) {
      newErrors.city = "City is required";

      isValid = false;
    }

    if (!formData.address.district.trim()) {
      newErrors.district = "District is required";

      isValid = false;
    }

    if (!formData.address.state.trim()) {
      newErrors.state = "State is required";

      isValid = false;
    }

    if (!formData.address.pin) {
      newErrors.pin = "PIN is required";

      isValid = false;
    } else if (!/^\d{6}$/.test(String(formData.address.pin))) {
      newErrors.pin = "PIN must be 6 digits";

      isValid = false;
    }

    if (!formData.login.username.trim()) {
      newErrors.username = "Username is required";

      isValid = false;
    }

    if (!formData.login.password.trim()) {
      newErrors.password = "Password is required";

      isValid = false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.login.password,
      )
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters";

      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

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

      console.log(res.data);
    } catch (error) {
      console.error("Registration Failed:", error);
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
