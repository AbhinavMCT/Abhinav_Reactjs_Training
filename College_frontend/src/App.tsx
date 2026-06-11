import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login.tsx";
import StudentHome from "./pages/student/StudentHome.tsx";
import AdminHome from "./pages/admin/Adminhome.tsx";
import StaffHome from "./pages/staff/Staffhome.tsx";

import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import NotFound from "./pages/Notfound.tsx";
import HomePage from "./components/HomePage.tsx";

import AppRoutes from "./routes/AppRoutes.tsx";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/login"
            element={<Login />}
          />

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

          {AppRoutes()}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default App;
