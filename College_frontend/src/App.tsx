import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.tsx";
import StudentHome from "./pages/student/StudentHome.tsx";
import AdminHome from "./pages/admin/Adminhome.tsx";
import StaffHome from "./pages/staff/Staffhome.tsx";

import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import NotFound from "./pages/Notfound.tsx";

import AppRoutes from "./routes/AppRoutes.tsx";

function App() {
  return (
    <Router>
      <Routes>

        
        <Route path="/" element={<Login />} />

        
        <Route
          path="/student-home"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentHome />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/staff-home"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffHome />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminHome />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Routes */}
        {AppRoutes()}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;