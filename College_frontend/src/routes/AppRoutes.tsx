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
import Editsubjectstaff from "../pages/subjectstaff/Editsubjectstaff.tsx";
import ViewActivityLog from "../pages/admin/ActivityLog.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";

function AppRoutes() {
  return (
    <>
      {/* Student Routes */}

      {/* ================= STUDENT ROUTES ================= */}

      <Route
        path="/student-management"
        element={
          <ProtectedRoute allowedRoles={["Admin", "staff"]}>
            <StudentManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <ViewStudent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/register"
        element={
          <ProtectedRoute allowedRoles={["Admin", "staff"]}>
            <RegisterStudent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["Admin", "staff"]}>
            <EditStudent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/edit-profile"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      {/* ================= STAFF ROUTES ================= */}

      <Route
        path="/staff-management"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <StaffManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/register"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <RegisterStaff />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditStaff />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/edit-profile"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/profile"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <ViewStaff />
          </ProtectedRoute>
        }
      />

      {/* ================= EXAM ROUTES ================= */}

      <Route
        path="/exam-management"
        element={
          <ProtectedRoute allowedRoles={["Admin", "staff"]}>
            <ExamManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/exam/add"
        element={
          <ProtectedRoute allowedRoles={["Admin", "staff"]}>
            <AddExam />
          </ProtectedRoute>
        }
      />

      <Route
        path="/exam/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["Admin", "staff"]}>
            <EditExam />
          </ProtectedRoute>
        }
      />

      {/* ================= SUBJECT ROUTES ================= */}

      <Route
        path="/subject-management"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <SubjectManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subject/add"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AddSubject />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subject/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditSubject />
          </ProtectedRoute>
        }
      />

      {/* ================= COURSE ROUTES ================= */}

      <Route
        path="/course-management"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <CourseManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/add"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AddCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditCourse />
          </ProtectedRoute>
        }
      />

      {/* ================= DEPARTMENT ROUTES ================= */}

      <Route
        path="/department-management"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <DepartmentManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/departments/add"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AddDepartment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/department/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EditDepartment />
          </ProtectedRoute>
        }
      />

      {/* ================= SUBJECT STAFF ROUTES ================= */}

      <Route
        path="/subjectstaff/add"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AddSubjectStaff />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subject-staff"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AllocateSubjectStaff />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subjectstaff/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Editsubjectstaff />
          </ProtectedRoute>
        }
      />

      {/* ================= ACTIVITY LOG ================= */}

      <Route
        path="/activity-log"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ViewActivityLog />
          </ProtectedRoute>
        }
      />
    </>
  );
}

export default AppRoutes;
