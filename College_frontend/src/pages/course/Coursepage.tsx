import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { createCourse, getAllDepartments, updateCourse, getCourseById } from "../../services/CourseApi.ts";

import { CoursePayload, DepartmentOption } from "../../types/Datatypes.ts";

import CourseForm from "../../components/Courseform.tsx";
import { toast } from "react-toastify";
import withCrudPage from "../hoc/withCrudPage.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";

type coursePageProps = {
  id?: string;
  navigate: ReturnType<typeof useNavigate>;
  isEditMode: boolean;
};

const AddCourse = ({ id, navigate }: coursePageProps) => {
  

  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  const [formData, setFormData] = useState<CoursePayload>({
    name: "",
    dep_id: 0,
  });

  const [errors, setErrors] = useState({
  name: "",
  dep_id: "",
});

const validateForm = () => {
  const newErrors = {
    name: "",
    dep_id: "",
  };

  let isValid = true;

  if (!formData.name.trim()) {
    newErrors.name = "Course name is required";
    isValid = false;
  } else if (formData.name.trim().length < 3) {
    newErrors.name =
      "Course name must be at least 3 characters";
    isValid = false;
  }

  if (formData.dep_id === 0) {
    newErrors.dep_id =
      "Please select a department";
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};

  const isEditmode = Boolean(id);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await getAllDepartments();

        setDepartments(response.data.department);
      } catch (error) {
        console.error(error);
      }
    };

    loadDepartments();
  }, []);

  useEffect(() =>{
    const LoadCourse = async()=>{
        try{
          const response = await getCourseById(Number(id));
          setFormData(response.data[0]);
        }catch(error){
          console.error("Error Fetching Course", error);
        }
    };
    LoadCourse();
  }, [id, isEditmode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "dep_id" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      
      if (!validateForm()) {
        toast.error("Please fix the errors in the form");
        return;
      }

      if(!isEditmode) return;
      if(isEditmode){
        await updateCourse(Number(id), formData);
        toast.success("Updated SuccessFully");
      }else{
        await createCourse(formData);
        toast.success("Created SuccessFully");
      }

      navigate("/course-management");
    } catch (error) {
      console.error(error);
      alert("Failed to create course");
    }
  };

  return (
    <div>
      <h2>
        {isEditmode ? "Edit Course" : "Add Course"}
        <Breadcrumbs />
      </h2>
      <CourseForm
        formData={formData}
        departments={departments}
        loadingDepartments={false}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        errors={errors}
        buttonText={
          isEditmode ? "Update Course": "Add Course"
        }
        title = {isEditmode ? "Edit Course" : "Add Course"}
      />
    </div>
  );
};


export default withCrudPage(AddCourse);
