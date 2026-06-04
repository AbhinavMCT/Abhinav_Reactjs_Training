import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createExam, getExamById, updateExam } from "../../services/ExamApi.ts";
import { getAllCourses } from "../../services/CourseApi.ts";

import { Exam } from "../../types/Datatypes.ts";
import { toast } from "react-toastify";
import Examform from "../../components/Examform.tsx";

interface CourseOption {
  id: number;
  name: string;
}

const AddExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);

  const [formData, setFormData] = useState<Exam>({
    id: 0,
    name: "",
    semester: 0,
    exam_date: "",
    course_id: 0,
  });

  const isEditMode = Boolean(id);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getAllCourses();
        console.log("Courses fetched:", response.data);
        setCourses(response.data);
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
        console.log("Exam fetched:", response.data[0]);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "semester" || e.target.name === "course_id"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.course_id === 0) {
      alert("Please select a valid course.");
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
      <Examform
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        title={isEditMode ? "Edit Exam" : "Add Exam"}
        loadingCourses={loadingCourses}
        courses={courses}
        buttonText={isEditMode ? "Update Exam" : "Add Exam"}
      />
    </div>
  );
};

export default AddExam;
