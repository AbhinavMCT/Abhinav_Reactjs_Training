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
import StudentCourseView from "../pages/studentcourse/ViewAllocatedstudentcourse.tsx";
import Viewattendence from "../pages/attendence/Viewattendence.tsx";
import MarkAttendance from "../pages/attendence/MarkAttendence.tsx";
import ViewAttendenceStudents from "../pages/attendence/ViewattendenceStudent.tsx";
import MarkPages from "../pages/mark/MarkPage.tsx";
import MarkView from "../pages/mark/MarkView.tsx";
import ViewProfileMark from "../pages/mark/ViewProfileMark.tsx";
import AssignmentView from "../pages/assignment/AssignmentView.tsx";
import AssignmentPage from "../pages/assignment/AssignmentPage.tsx";
import ViewAssignments from "../pages/assignment/ViewAssignments.tsx";
import ViewExamsStudents from "../pages/exam/ViewExam.tsx";


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
    path: "/student-management/edit/:id",
    element: <EditStudentPage />,
    roles: ["Admin", "staff"],
  },

  {
    path: "/student-home/profile",
    element: <ViewStudent />,
    roles: ["student"],
  },

  {
    path: "/student-home/profile/attendenc-view",
    element: <ViewAttendenceStudents />,
    roles: ["student"],
  },

  {
    path: "/student-home/edit-profile",
    element: <EditStudentPage />,
    roles: ["student"],
  },

  {
    path: "/view-all-attendence",
    element: <Viewattendence />,
    roles: ["Admin", "staff"],
  },

  {
    path: "/view-all-attendence/mark-attendence",
    element: < MarkAttendance/>,
    roles: ["Admin", "staff"]
  },

  {
    path: "/staff-management",
    element: <StaffManagement />,
    roles: ["Admin"],
  },

  

  {
    path: "/staff-management/edit/:id",
    element: <EditStaffProfile />,
    roles: ["Admin"],
  },

  {
    path: "/staff-home/profile",
    element: <ViewStaff />,
    roles: ["staff"],
  },

  {
    path: "/staff-home/edit-profile",
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
    path: "/subject-management/add",
    element: <SubjectPage />,
    roles: ["Admin"],
  },

  {
    path: "/subject-management/edit/:id",
    element: <SubjectPage />,
    roles: ["Admin"],
  },

  {
    path: "/course-management",
    element: <CourseManagement />,
    roles: ["Admin"],
  },

  {
    path: "/course-management/add",
    element: <Coursepage />,
    roles: ["Admin"],
  },

  {
    path: "/course-management/edit/:id",
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
    path:"/student-home/profile/view",
    element: <StudentCourseView />,
    roles: ["student"]
  },

  {
    path: "/activity-log",
    element: <ViewActivityLog />,
    roles: ["Admin"],
  },
  {
    path: "/mark-page/add",
    element: <MarkPages />,
    roles: ["staff", "Admin"],
  },
  {
    path: "/mark-page/edit/:id",
    element: <MarkPages />,
    roles: ["staff", "Admin"],
  },
  {
    path: "/mark-page",
    element: <MarkView />,
    roles: ["staff", "Admin"],
  },
  {
    path: "/student-home/profile/mark-view",
    element: <ViewProfileMark />,
    roles: ["student"]
  },
  {
    path: "/assignment-view",
    element: <AssignmentView />,
    roles: ["Admin","staff"]
  },
  {
    path: "/assignment-view/add",
    element: <AssignmentPage />,
    roles: ["Admin","staff"]
  },
  {
    path: "/assignment-view/edit/:id",
    element: <AssignmentPage />,
    roles: ["Admin","staff"]
  },
  {
    path: "/students-assignment",
    element: <ViewAssignments />,
    roles: ["student"],
  },
  {
    path: "/exams-view",
    element: <ViewExamsStudents />,
    roles: ["student"],
  }
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
