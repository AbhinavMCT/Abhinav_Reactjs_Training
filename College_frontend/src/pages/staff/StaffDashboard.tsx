import DashboardLayout from "../../components/DashboardLayout.tsx";
import { decodeToken } from "../../utils/Jwt.ts";

const StaffDashboard = () => {
  const menuItems = [
    { name: "Profile", path: "/staff/profile" },
    { name: "Assigned Subjects", path: "/staff/assigned-subjects" },
    { name: "Upload Marks", path: "/staff/upload-marks" },
    { name: "Attendance", path: "/staff/attendance" },
    { name: "Student Management", path: "/student-management" },
    {name: "Exam Management", path: "/exam-management" }
    
  ];

  const token: any = localStorage.getItem("access");
  const decoded = decodeToken(token);


  return (
    <DashboardLayout
      title="Staff Dashboard"
      username={decoded.username}
      role={decoded.role}
      menuItems={menuItems}
    >
      <h2>Welcome Staff</h2>
    </DashboardLayout>
  );
}

export default StaffDashboard;