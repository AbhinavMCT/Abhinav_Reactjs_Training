import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SubjectForm from "../../components/SubjectForm.tsx";

import { createSubject,getSubjectById,updateSubject, getAllCourses } from "../../services/SubjectApi.ts";

import { SubjectPayload, CourseOption } from "../../types/Datatypes.ts";
import { toast } from "react-toastify";
import withCrudPage from "../hoc/withCrudPage.tsx";


type subjectPageProps = {
  id?: string;
  navigate: ReturnType<typeof useNavigate>;
  isEditMode: boolean;
};

const AddSubject = ({
  id,
  navigate,
  isEditMode,
}:subjectPageProps ) => {
  
  const [courses, setCourses] = useState<CourseOption[]>([]);
  
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [formData, setFormData] = useState<SubjectPayload>({
    name: "",
    type: "",
    course_id: 0,
  });


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
  };

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

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
    />
  );
};

export default withCrudPage(AddSubject);