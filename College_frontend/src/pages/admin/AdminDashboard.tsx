import DashboardLayout from "../../components/DashboardLayout.tsx";
import StatCard from "../../components/StatCard.tsx";
import "../../styles/cards.css";

const AdminDashboard = () => {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Staff Management", path: "/staff-management" },
    { name: "Student Management", path: "/student-management" },
    { name: "Exam Management", path: "/exam-management" },
    { name: "Subject Management", path: "/subject-management" },
    { name: "Course Management", path: "/course-management" },
    {name: "Department Management", path: "/department-management" },
    {name: "Activity logs", path: "/activity-log"},
    
  ];

  return (
    <DashboardLayout title="Admin Dashboard" role="Admin" menuItems={menuItems}>
      <div className="card-grid">
        <StatCard title="Total Students" value="1500" />
        <StatCard title="Total Staff" value="120" />
        <StatCard title="Upcoming Exams" value="12" />
        <StatCard title="Pass Percentage" value="92%" />
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;