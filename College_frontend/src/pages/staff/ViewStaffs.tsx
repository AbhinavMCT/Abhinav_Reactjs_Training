import Breadcrumbs from "../../components/Breadcrumbs.tsx";
import "../../styles/staff/viewstaff.css";

const ViewStaff = () => {
  const staffList = [
    {
      id: 1,
      staffCode: "STF001",
      name: "Aleena Thomas",
      department: "Computer Applications",
      designation: "Assistant Professor",
      contact: "9876543210",
    },
    {
      id: 2,
      staffCode: "STF002",
      name: "Aiswary Udhayan",
      department: "Computer Applications",
      designation: "Professor",
      contact: "9876543211",
    },
    {
      id: 3,
      staffCode: "STF003",
      name: "Anjana Krishnan",
      department: "Science",
      designation: "Associate Professor",
      contact: "9876543212",
    },
    {
      id: 4,
      staffCode: "STF004",
      name: "Elsa Rani",
      department: "Language",
      designation: "Associate Professor",
      contact: "9876543246",
    },
    {
      id: 5,
      staffCode: "STF005",
      name: "Jishnu Raj",
      department: "Comerce",
      designation: "Associate Professor",
      contact: "9876567246",
    },
    {
      id: 6,
      staffCode: "STF006",
      name: "Abiya R",
      department: "Business Administartion",
      designation: "Associate Professor",
      contact: "9876567246",
    },
  ];

  return (
    <div className="staff-management-container">
      <div className="management-header">
        <h2>Staff Members</h2>
        <Breadcrumbs />
      </div>

      <div className="staff-container">
        {staffList.map((staff) => (
          <div className="staff-card" key={staff.id}>
            <div className="staff-header">
              <div className="staff-avatar">
                {staff.name.charAt(0)}
              </div>

              <div>
                <h3 className="staff-name">
                  {staff.name}
                </h3>

                <span className="staff-code">
                  {staff.staffCode}
                </span>
              </div>
            </div>

            <div className="staff-info">
              <div className="info-row">
                <span className="info-label">Department</span>
                <span className="info-value">
                  {staff.department}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Designation</span>
                <span className="info-value">
                  {staff.designation}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Contact</span>
                <span className="info-value">
                  {staff.contact}
                </span>
              </div>
            </div>

            <div className="staff-footer">
              <button className="view-btn">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewStaff;