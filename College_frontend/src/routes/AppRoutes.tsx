import { Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.tsx";
import RegisterUser from "../pages/RegisterUser.tsx";


import StudentManagement from "../pages/admin/StudentManagement.tsx";
import ViewStudent from "../pages/student/ViewStudentProfile.tsx";
import EditStudentPage from "../pages/student/EditStudentPage.tsx";

import StaffManagement from "../pages/admin/StaffManagement.tsx";
import ViewStaff from "../pages/staff/ViewStaffProfile.tsx";
import EditStaffProfile from "../pages/staff/EditStaffPage.tsx";

import ExamManagement from "../pages/admin/ExamManagement.tsx";
import Exampage from "../pages/exam/Exampage.tsx";

import SubjectManagement from "../pages/admin/SubjectManagement.tsx";
import SubjectPage from "../pages/subjects/Subjectpage.tsx";

import CourseManagement from "../pages/admin/CourseManagement.tsx";
import Coursepage from "../pages/course/Coursepage.tsx";

import DepartmentManagement from "../pages/admin/DepartmentManagement.tsx";
import DepartmentPage from "../pages/department/DepartmentPage.tsx";

import AllocateSubjectStaff from "../pages/admin/Allocatesubjectstaff.tsx";
import AllocationPage from "../pages/subjectstaff/SubjectStaffAllocationPage.tsx";

import ViewActivityLog from "../pages/admin/ActivityLog.tsx";
import AllocateStudentCourse from "../pages/admin/Allocatestudentcourse.tsx";
import StudentCoursePage from "../pages/studentcourse/StudentCoursePage.tsx";

const routes = [

  {
    path: "/staff-management/register",
    element: <RegisterUser />,
    roles: ["Admin"],
  },

  {
    path: "/student-management/register",
    element: <RegisterUser />,
    roles: ["Admin","staff"],
  },

  {
    path: "/student-management",
    element: <StudentManagement />,
    roles: ["Admin", "staff"],
  },



  {
    path: "/student/edit/:id",
    element: <EditStudentPage />,
    roles: ["Admin", "staff"],
  },

  {
    path: "/student/profile",
    element: <ViewStudent />,
    roles: ["student"],
  },

  {
    path: "/student/edit-profile",
    element: <EditStudentPage />,
    roles: ["student"],
  },

  {
    path: "/staff-management",
    element: <StaffManagement />,
    roles: ["Admin"],
  },

  

  {
    path: "/staff/edit/:id",
    element: <EditStaffProfile />,
    roles: ["Admin"],
  },

  {
    path: "/staff/profile",
    element: <ViewStaff />,
    roles: ["staff"],
  },

  {
    path: "/staff/edit-profile",
    element: <EditStaffProfile />,
    roles: ["staff"],
  },

  {
    path: "/exam-management",
    element: <ExamManagement />,
    roles: ["Admin", "staff"],
  },

  {
    path: "/exam-management/add",
    element: <Exampage />,
    roles: ["Admin", "staff"],
  },

  {
    path: "/exam-management/edit/:id",
    element: <Exampage />,
    roles: ["Admin", "staff"],
  },

  {
    path: "/subject-management",
    element: <SubjectManagement />,
    roles: ["Admin"],
  },

  {
    path: "/subject/add",
    element: <SubjectPage />,
    roles: ["Admin"],
  },

  {
    path: "/subject/edit/:id",
    element: <SubjectPage />,
    roles: ["Admin"],
  },

  {
    path: "/course-management",
    element: <CourseManagement />,
    roles: ["Admin"],
  },

  {
    path: "/course/add",
    element: <Coursepage />,
    roles: ["Admin"],
  },

  {
    path: "/course/edit/:id",
    element: <Coursepage />,
    roles: ["Admin"],
  },

  {
    path: "/department-management",
    element: <DepartmentManagement />,
    roles: ["Admin"],
  },

  {
    path: "/department-management/add",
    element: <DepartmentPage />,
    roles: ["Admin"],
  },

  {
    path: "/department-management/edit/:id",
    element: <DepartmentPage />,
    roles: ["Admin"],
  },

  {
    path: "/subject-staff",
    element: <AllocateSubjectStaff />,
    roles: ["Admin"],
  },


  {
    path: "/subject-staff/add",
    element: <AllocationPage />,
    roles: ["Admin"],
  },

  {
    path: "/subject-staff/edit/:id",
    element: <AllocationPage />,
    roles: ["Admin"],
  },

  {
    path: "/student-course",
    element: <AllocateStudentCourse />,
    roles: ["Admin", "staff"],
  },

  {
    path: "/student-course/add",
    element: <StudentCoursePage />,
    roles: ["Admin", "staff"]
  },

  {
    path: "/student-course/edit/:id",
    element: <StudentCoursePage />,
    roles: ["Admin", "staff"]
  },

  {
    path: "/activity-log",
    element: <ViewActivityLog />,
    roles: ["Admin"],
  },
];

function AppRoutes() {
  return (
    <>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ProtectedRoute allowedRoles={route.roles}>
              {route.element}
            </ProtectedRoute>
          }
        />
      ))}
    </>
  );
}

export default AppRoutes;
