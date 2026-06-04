import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { createCourse, getAllDepartments, updateCourse, getCourseById } from "../../services/CourseApi.ts";

import { CoursePayload, DepartmentOption } from "../../types/Datatypes.ts";

import CourseForm from "../../components/Courseform.tsx";
import { toast } from "react-toastify";

const AddCourse = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  const [formData, setFormData] = useState<CoursePayload>({
    name: "",
    dep_id: 0,
  });

  const isEditmode = Boolean(id);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await getAllDepartments();

        setDepartments(response.data);
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
      </h2>
      <CourseForm
        formData={formData}
        departments={departments}
        loadingDepartments={false}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={
          isEditmode ? "Update Course": "Add Course"
        }
        title = {isEditmode ? "Edit Course" : "Add Course"}
      />
    </div>
  );
};

export default AddCourse;
