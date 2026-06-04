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
  

  const [formData, setFormData] = useState<Department>({
    name: "",
    type: "",
    office_location: "",
    established_year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (!isEditMode) return;

    const fetchDepartment = async () => {
      try {
        const response = await getDepartmentById(Number(id));
        console.log(response);

        setFormData(response[0]);
      } catch (error) {
        console.error("Error fetching department:", error);
      }
    };

    fetchDepartment();
  }, [id, isEditMode]);

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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

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
      <h2>
        {isEditMode ? "Edit Department" : "Add Department"}
      </h2>

      <DepartmentForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
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