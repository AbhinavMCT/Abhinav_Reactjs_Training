import DashboardLayout from "../../components/DashboardLayout.tsx";

const StaffDashboard = () => {
  const menuItems = [
    { name: "Profile", path: "/staff/profile" },
    { name: "Assigned Subjects", path: "/staff/assigned-subjects" },
    { name: "Upload Marks", path: "/staff/upload-marks" },
    { name: "Attendance", path: "/staff/attendance" },
    { name: "Student Management", path: "/student-management" },
    
  ];

  return (
    <DashboardLayout
      title="Staff Dashboard"
      role="Staff"
      menuItems={menuItems}
    >
      <h2>Welcome Staff</h2>
    </DashboardLayout>
  );
}

export default StaffDashboard;