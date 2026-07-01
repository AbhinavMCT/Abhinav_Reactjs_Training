import { useEffect, useState } from "react";

import SubjectForm from "../../components/SubjectForm.tsx";

import { createSubject,getSubjectById,updateSubject, getAllCourses } from "../../services/SubjectApi.ts";

import { SubjectPayload, CourseOption, pageprops } from "../../types/Datatypes.ts";
import { toast } from "react-toastify";
import withCrudPage from "../hoc/withCrudPage.tsx";


const AddSubject = ({id,navigate,isEditMode,}:pageprops ) => {
  
  const [courses, setCourses] = useState<CourseOption[]>([]);
  
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [formData, setFormData] = useState<SubjectPayload>({
    name: "",
    type: "",
    course_id: 0,
  });

  const [errors, setErrors] = useState({
  name: "",
  type: "",
  course_id: "",
});

const validate = () => {
  const newErrors = {
    name: "",
    type: "",
    course_id: "",
  };

  let isValid = true;

  if (!formData.name.trim()) {
    newErrors.name = "Subject name is required";
    isValid = false;
  } else if (formData.name.trim().length < 3) {
    newErrors.name = "Minimum 3 characters required";
    isValid = false;
  } else if (!/^[A-Za-z ]+$/.test(formData.name.trim())) {
    newErrors.name = "Only letters and spaces are allowed";
    isValid = false;
  }

  if (!formData.type) {
    newErrors.type = "Please select subject type";
    isValid = false;
  }

  if (!formData.course_id) {
    newErrors.course_id = "Please select a course";
    isValid = false;
  }

  setErrors(newErrors);

  return isValid;
};


  useEffect(() => {
    const fetchCourses = async () => {
    try {

      const response = await getAllCourses();

      setCourses(response.data.course);

    } catch (error) {

      console.error(error);

    } finally {

      setLoadingCourses(false);
    }
  };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchSubject = async () => {
      try {
        const response = await getSubjectById(Number(id));
        console.log(response.data[0]);
        setFormData(response.data[0]);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubject();
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.name === "course_id"
          ? Number(e.target.value)
          : e.target.value,
    });

    setErrors({
    ...errors,
    [e.target.name]: "",
  });
  };

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {

    e.preventDefault();
    if (!validate()) return;

    try {

      if (isEditMode) {
        await updateSubject(Number(id), formData);
        toast.success("Updated Successfully");
      }else{
        await createSubject(formData);
        toast.success("Created Successfully");
      }

      navigate("/subject-management");

    } catch (error) {

      console.error(error);
    }
  };

  return (
    <SubjectForm
      title={isEditMode ? "Edit Subject" : "Create Subject"}
      formData={formData}
      courses={courses}
      loadingCourses={loadingCourses}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      buttonText={isEditMode ? "Update Subject" : "Create Subject"}
      errors={errors}
    />
  );
};

export default withCrudPage(AddSubject);