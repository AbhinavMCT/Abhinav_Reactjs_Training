import DashboardLayout from "../../components/DashboardLayout.tsx";
import StatCard from "../../components/StatCard.tsx";



import "../../styles/cards.css";


const StudentDashboard = () => {

  const menuItems = [
    { name: "Profile", path: "/student/profile" },
    { name: "Exams", path: "/student/exams" },
    { name: "Results", path: "/student/results" },
    { name: "Hall Ticket", path: "/student/hall-ticket" },
    { name: "Attendance", path: "/student/attendance" },
  ];

  return (
    <DashboardLayout
      title="Student Dashboard"
      role="Student"
      menuItems={menuItems}
    >

     
      <div className="student-welcome-card">

        <div>
          <h2>Welcome Back, Student 🎓</h2>

          <p>
            Track your academics, attendance, and examination details easily.
          </p>
        </div>

        

      </div>

      
      <div className="card-grid">

        <StatCard title="Attendance" value="94%" />

        <StatCard title="Subjects" value="8" />

        <StatCard title="Upcoming Exams" value="3" />

        <StatCard title="Current GPA" value="8.9" />

      </div>

    </DashboardLayout>
  );
};

export default StudentDashboard;