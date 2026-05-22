import { Route } from "react-router-dom";
import StudentManagement from "../pages/admin/StudentManagement.tsx";
import StaffManagement from "../pages/admin/StaffManagement.tsx";
import ViewStudent from "../pages/student/ViewStudentProfile.tsx";
import RegisterStudent from "../pages/student/RegisterStudent.tsx";
import EditStudent from "../pages/admin/EditStudent.tsx";
import EditProfile from "../pages/student/EditStudentProfile.tsx";
import RegisterStaff from "../pages/staff/RegisterStaff.tsx";
import EditStaff from "../pages/admin/EditStaff.tsx";
import ViewStaff from "../pages/staff/ViewStaffProfile.tsx";
import EditExam from "../pages/exam/EditExam.tsx";
import AddExam from "../pages/exam/AddExam.tsx";
import ExamManagement from "../pages/admin/ExamManagement.tsx";
import EditSubject from "../pages/subjects/EditSubject.tsx";
import AddSubject from "../pages/subjects/AddSubject.tsx";
import SubjectManagement from "../pages/admin/SubjectManagement.tsx";
import EditCourse from "../pages/course/EditCourse.tsx";
import AddCourse from "../pages/course/AddCourse.tsx";
import CourseManagement from "../pages/admin/CourseManagement.tsx";
import AddDepartment from "../pages/department/AddDepartment.tsx";
import DepartmentManagement from "../pages/admin/DepartmentManagement.tsx";
import EditDepartment from "../pages/department/EditDepartment.tsx";
import AddSubjectStaff from "../pages/subjectstaff/Addsubjectstaff.tsx";
import AllocateSubjectStaff from "../pages/admin/Allocatesubjectstaff.tsx";

function AppRoutes() {
  return (
    <>
      {/* Student Routes */}
      <Route path="/student-management" element={<StudentManagement />} />
      <Route path="/student/profile" element={<ViewStudent />} />
      <Route path="/student/register" element={<RegisterStudent />} />
      <Route path="/student/edit/:id" element={<EditStudent />} />
      <Route path="/student/edit-profile" element={<EditProfile />} />

      {/* Staff Routes */}
      <Route path="/staff-management" element={<StaffManagement />} />
      <Route path="/staff/register" element={<RegisterStaff />} />
      <Route path="/staff/edit/:id" element={<EditStaff />} />
      <Route path="/staff/edit-profile" element={<EditProfile />} />
      <Route path="/staff/profile" element={<ViewStaff />} />

      {/* Exam Routes */}
      <Route path="/exam-management" element={<ExamManagement />} />
      <Route path="/exam/add" element={<AddExam />} />
      <Route path="/exam/edit/:id" element={<EditExam />} />

      {/* Subject Routes */}
      <Route path="/subject-management" element={<SubjectManagement />} />
      <Route path="/subject/add" element={<AddSubject />} />
      <Route path="/subject/edit/:id" element={<EditSubject />} />

      {/* Course Routes */}
      <Route path="/course-management" element={<CourseManagement />} />
      <Route path="/course/add" element={<AddCourse />} />
      <Route path="/course/edit/:id" element={<EditCourse />} />

      {/* Department Routes */}
      <Route path="/department-management" element={<DepartmentManagement />} />
      <Route path="/departments/add" element={<AddDepartment />} />
      <Route path="/department/edit/:id" element={<EditDepartment />} />

      {/* Subject-Staff Allocate Routes */}
      <Route path="/subjectstaff/add" element={<AddSubjectStaff />} />
      <Route path="/subject-staff" element={<AllocateSubjectStaff />} />
    </>
  );
}

export default AppRoutes;
