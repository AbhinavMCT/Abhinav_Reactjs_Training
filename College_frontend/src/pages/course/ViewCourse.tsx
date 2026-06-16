import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import "../../styles/course/viewcourse.css";

const ViewCourse = () => {
  const courses = [
    {
      id: 1,
      courseCode: "BCA101",
      courseName: "Bachelor of Computer Applications",
      duration: "3 Years",
      students: 150,
    },
    {
      id: 2,
      courseCode: "BA102",
      courseName: "BA English",
      duration: "3 Years",
      students: 120,
    },
    {
      id: 3,
      courseCode: "MBA201",
      courseName: "Master of Business Administration",
      duration: "2 Years",
      students: 80,
    },
    {
      id: 4,
      courseCode: "MCA301",
      courseName: "Master of Computer Applications",
      duration: "2 Years",
      students: 90,
    },
    {
      id: 5,
      courseCode: "BSC201",
      courseName: "Bsc Chemistry",
      duration: "3 Years",
      students: 80,
    },
    {
      id: 6,
      courseCode: "BSC301",
      courseName: "Bsc Bottony",
      duration: "3 Years",
      students: 90,
    },
    {
      id: 7,
      courseCode: "BA201",
      courseName: "BA Malayalam",
      duration: "3 Years",
      students: 80,
    },
    {
      id: 8,
      courseCode: "COM301",
      courseName: "B COM",
      duration: "3 Years",
      students: 90,
    },
  ];

  return (
    <div className="student-management-container">
      <div className="management-header">
        <h2>Courses</h2>
        <Breadcrumbs />
      </div>

      <div className="course-container">
        {courses.map((course) => (
          <div className="course-card" key={course.id}>
            <div className="course-header">
              <h3 className="course-title">{course.courseName}</h3>
              <span className="course-badge">{course.courseCode}</span>
            </div>

            <div className="course-info">
              <div className="info-row">
                <span className="info-label">Duration</span>
                <span className="info-value">{course.duration}</span>
              </div>

              

              
            </div>

            <div className="course-footer">
              <span className="student-count">
                👨‍🎓 {course.students} Students
              </span>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCourse;
