import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DepartmentForm from "../../components/DepartmentForm.tsx";
import {
  createDepartment,
  getDepartmentById,
  updateDepartment,
} from "../../services/DepartmentApi.ts";

import { Department } from "../../types/Datatypes.ts";
import { toast } from "react-toastify";
import withCrudPage from "../hoc/withCrudPage.tsx";


type DepartmentPageProps = {
  id?: string;
  navigate: ReturnType<typeof useNavigate>;
  isEditMode: boolean;
};

const DepartmentPage = ({
  id,
  navigate,
  isEditMode
}: DepartmentPageProps) => {
  
  const [errors, setErrors] = useState({
  name: "",
  type: "",
  office_location: "",
  established_year: "",
});

  const [formData, setFormData] = useState<Department>({
    name: "",
    type: "",
    office_location: "",
    established_year: new Date().getFullYear(),
  });

  const validateForm = () => {
  const newErrors = {
    name: "",
    type: "",
    office_location: "",
    established_year: "",
  };

  let isValid = true;

  if (!formData.name.trim()) {
    newErrors.name = "Department name is required";
    isValid = false;
  } else if (formData.name.trim().length < 3) {
    newErrors.name =
      "Department name must be at least 3 characters";
    isValid = false;
  }

  if (!formData.type.trim()) {
    newErrors.type = "Department type is required";
    isValid = false;
  }

  if (!formData.office_location.trim()) {
    newErrors.office_location =
      "Office location is required";
    isValid = false;
  }

  const currentYear = new Date().getFullYear();

  if (
    formData.established_year < 1900 ||
    formData.established_year > currentYear
  ) {
    newErrors.established_year =
      `Year must be between 1900 and ${currentYear}`;
    isValid = false;
  }

  setErrors(newErrors);

  return isValid;
};

  useEffect(() => {
    if (!isEditMode) return;

    const fetchDepartment = async () => {
      try {
        const response = await getDepartmentById(Number(id));
        console.log(response);

        setFormData(
  response.data?.[0] ?? {
    id: 0,
    department_name: "",
    office_location: "",
    established_year: new Date().getFullYear(),
  }
);
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };

    fetchDepartment();
  }, [id, isEditMode]);

  const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement
  >
) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]:
      name === "established_year"
        ? Number(value)
        : value,
  });

  setErrors({
    ...errors,
    [name]: "",
  });
};

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    try {
      if (isEditMode) {
        await updateDepartment(Number(id), formData);

        toast.success("Updated Successfully");
      } else {
        await createDepartment(formData);

        toast.success("Created Successfully");
      }

      navigate("/department-management");
    } catch (error) {
      console.error(error);
      toast.error("Operation Failed");
    }
  };

  

  return (
    <div>
      

      <DepartmentForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        errors={errors}
        title={isEditMode ? "Edit Department" : "Add Department"}
        buttonText={
          isEditMode
            ? "Update Department"
            : "Add Department"
        }
      />
    </div>
  );
};

export default withCrudPage(DepartmentPage);