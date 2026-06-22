import { useState, useEffect } from "react";
import { StudentCourse, Studentlist, Courselist, pageprops } from "../../types/Datatypes.ts";
import {updateStudentCourse,createStudentCourse,getStudentcoursebyId} from "../../services/StudentCourseApi.ts";
import { getAllCourses } from "../../services/CourseApi.ts";
import { getAllStudents } from "../../services/StudentApi.ts";
import { toast } from "react-toastify";
import StudentCourseForm from "../../components/StudentCourseForm.tsx";
import withCrudPage from "../hoc/withCrudPage.tsx";


const StudentCoursePage = ({id,navigate,isEditMode}: pageprops) => {

  const [formData, setFormData] = useState<StudentCourse>({
    id: 0,
    student_id: 0,
    course_id: 0,
  });
  const [students, setStudents] = useState<Studentlist[]>([]);
  const [courses, setCourses] = useState<Courselist[]>([]);


  useEffect(() => {
  const loadData = async () => {
    try {
      
      const [studentData, courseData] = await Promise.all([
        getAllStudents(1, 10,""),
        getAllCourses(10, 1,""),
      ]);

      setStudents(
        Array.isArray(studentData.data.students)
          ? studentData.data.students
          : JSON.parse(studentData.data.students)
      );

      setCourses(
        Array.isArray(courseData.data.course)
          ? courseData.data.course
          : JSON.parse(courseData.data.course)
      );

      if (id) {
        const allocData = await getStudentcoursebyId(Number(id));
        setFormData(allocData.data[0]);
        
      }
    } catch (error) {
      console.error(error);
    }
  };

  loadData();
}, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "student_id" || name === "course_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>)=>{
    e.preventDefault();
    try{
        if(isEditMode){
            await updateStudentCourse(Number(id), formData);
            toast.success("Updated SuccessFully");
        }else{
            await createStudentCourse(formData);
            console.log(formData);
            toast.success("Allocated SuccessFully");
        }
        navigate("/student-course");
    } catch(error){
    console.error("Error submitting form", error);
    toast.error("Error submitting form");
    }
}
 return(
    <StudentCourseForm 
    formData={formData}
    students={students}
    courses={courses}
    handleChange={handleChange}
    handleSubmit={handleSubmit}
    buttonText={isEditMode ?"Edit":"Add"}
    title={isEditMode ?"Edit Allocation": "Add Allocation"}
    />
  );
};

export default withCrudPage(StudentCoursePage);
