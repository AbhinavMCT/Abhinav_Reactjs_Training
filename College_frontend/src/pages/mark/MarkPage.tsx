import { useState, useEffect } from "react";
import MarkForm from "../../components/MarkForm.tsx";
import {Marks,SubjectItem,Studentlist,Examlist, pageprops} from "../../types/Datatypes.ts";
import {getAllSubjects,createMark,getAllStudents,getAllExams, getMarkbyId, updateMark} from "../../services/MarkApi.ts";
import { toast } from "react-toastify";
import withCrudPage from "../hoc/withCrudPage.tsx";




const MarkPage = ({id, navigate, isEditMode}: pageprops) => {

  const [formData, setFormData] = useState<Marks>({
    id: 0,
    student_id: 0,
    subject_id: 0,
    exam_id: 0,
    mark: 0,
    grade: "",
  });

  const [students, setStudents] = useState<Studentlist[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [exams, setExams] = useState<Examlist[]>([]);

  const [errors, setErrors] = useState({
    student_id: "",
    subject_id: "",
    exam_id: "",
    mark: "",
    grade: "",
  });

  const calculateGrade = (mark: number) => {
    if (mark >= 90) return "A+";
    if (mark >= 80) return "A";
    if (mark >= 70) return "B+";
    if (mark >= 60) return "B";
    if (mark >= 50) return "C";
    return "F";
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentData, subjectData, examData] = await Promise.all([
          getAllStudents(),
          getAllSubjects(),
          getAllExams(),
        ]);

        setStudents(studentData.data.students);
        setSubjects(subjectData.data.subject);
        setExams(examData.data.exam);
      } catch {
        toast.error("Failed to load data");
      }
    };

    loadData();
  }, []);

  useEffect(() =>{
      const LoadMark = async()=>{
          try{
            const response = await getMarkbyId(Number(id));
            setFormData(response.data[0]);
          }catch(error){
            console.error("Error Fetching Course", error);
          }
      };
      LoadMark();
    }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "mark") {
      const numericMark = Number(value);

      setFormData((prev) => ({
        ...prev,
        mark: numericMark,
        grade: calculateGrade(numericMark),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "student_id" || name === "subject_id" || name === "exam_id"
            ? Number(value)
            : value,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {
      student_id: "",
      subject_id: "",
      exam_id: "",
      mark: "",
      grade: "",
    };

    let isValid = true;

    if (!formData.student_id) {
      newErrors.student_id = "Please select a student";
      isValid = false;
    }

    if (!formData.subject_id) {
      newErrors.subject_id = "Please select a subject";
      isValid = false;
    }

    if (!formData.exam_id) {
      newErrors.exam_id = "Please select an exam";
      isValid = false;
    }

    if (formData.mark <= 0) {
      newErrors.mark = "Mark must be greater than 0";
      isValid = false;
    }

    const selectedExam = exams.find((exam) => exam.id === formData.exam_id);

    if (selectedExam && formData.mark > Number(selectedExam.total_mark)) {
      newErrors.mark = `Mark cannot exceed ${selectedExam.total_mark}`;
      isValid = false;
    }

    if (!formData.grade.trim()) {
      newErrors.grade = "Grade is required";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if(isEditMode){
        await updateMark(Number(id), formData);
        toast.success("Updated Successfully");
      }else{
        await createMark(formData);
      toast.success("Mark created successfully");
      }
      navigate("/mark-page");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create mark");
    }
  };

  return (
    <MarkForm
      formData={formData}
      students={students}
      subjects={subjects}
      exams={exams}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      buttonText="Save Mark"
      title="Add Mark"
      errors={errors}
    />
  );
};

export default withCrudPage(MarkPage);

