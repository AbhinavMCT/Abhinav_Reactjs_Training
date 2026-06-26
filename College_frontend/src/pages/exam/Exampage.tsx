import { useState, useEffect } from "react";
import { createExam, getExamById, updateExam, getallCourse } from "../../services/ExamApi.ts";

import { Exam, CourseOption, pageprops } from "../../types/Datatypes.ts";
import { toast } from "react-toastify";
import Examform from "../../components/Examform.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import withCrudPage from "../hoc/withCrudPage.tsx";





const AddExam = ({ id, navigate, isEditMode }: pageprops) => {

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);

  const [errors, setErrors] = useState({
  name: "",
  semester: "",
  exam_date: "",
  course_id: "",
  exam_type: "",
  total_mark: "",
});

  const [formData, setFormData] = useState<Exam>({
    id: 0,
    name: "",
    semester: 0,
    exam_date: "",
    course_id: 0,
    exam_type: "",
    total_mark: 0
  });


  const validateForm = () => {
  const newErrors = {
    name: "",
    semester: "",
    exam_date: "",
    course_id: "",
    exam_type: "",
  total_mark: "",
  };

  let isValid = true;

  if (!formData.name.trim()) {
    newErrors.name = "Exam name is required";
    isValid = false;
  } else if (formData.name.trim().length < 3) {
    newErrors.name = "Exam name must be at least 3 characters";
    isValid = false;
  }

  if (formData.semester < 1 || formData.semester > 8) {
    newErrors.semester = "Semester must be between 1 and 8";
    isValid = false;
  }

  if (formData.exam_date === "")  {
    newErrors.exam_date = "Exam date is required";
    isValid = false;
  } else {
    const selectedDate = new Date(formData.exam_date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      newErrors.exam_date = "Exam date cannot be in the past";
      isValid = false;
    }
  }

  if (formData.course_id === 0) {
    newErrors.course_id = "Please select a course";
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getallCourse();;
        console.log("Courses fetched response payload:", response.data.course);
        
        setCourses(response.data.course);
        setLoadingCourses(false);
      } catch (error) {
        console.error("Error fetching courses", error);
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    const loadExam = async () => {
      if (!isEditMode) return;
      try {
        const response = await getExamById(Number(id));
        const exam = response.data[0];
        setFormData({
          ...exam,
          course_id: Number(exam.course_id),
          exam_date: exam.exam_date.split("T")[0],
        });
      } catch (error) {
        console.error("Error fetching exam", error);
      }
    };
    loadExam();
  }, [id, isEditMode]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]:
      name === "semester" || name === "course_id"
        ? Number(value)
        : value,
  });

  setErrors({
    ...errors,
    [name]: "",
  });
};

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
  return;
}

    try {
      if (isEditMode) {
        await updateExam(Number(id), formData);
        toast.success("Updated Successfully");
      } else {
        await createExam(formData);
        toast.success("Created Successfully");
      }

      navigate("/exam-management");
    } catch (error) {
      console.error(error);
      toast.error("Operation Failed");
    }
  };

  return (
    <div>
      <h2>{isEditMode ? "Edit Exam" : "Add Exam"}</h2>
      <Breadcrumbs />
      <Examform
        formData={formData}
        title={isEditMode ? "Edit Exam" : "Add Exam"}
        loadingCourses={loadingCourses}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        courses={courses}
        errors={errors}
        buttonText={isEditMode ? "Update Exam" : "Add Exam"}
      />
    </div>
  );
};

export default withCrudPage(AddExam);
