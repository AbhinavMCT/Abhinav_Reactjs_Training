import { useEffect, useState } from "react";
import { FaUserEdit, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

import { getProfile } from "../../services/StudentApi.ts";
import { ProfileData } from "../../types/Datatypes.ts";

import "../../styles/student/viewStudent.css";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs.tsx";

const ViewStudent = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();

        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="student-profile-container">
      {profile ? (
        <div className="student-profile-card">
          <Breadcrumbs />
          <div className="profile-banner">
            <div className="profile-left">
              <div className="profile-image">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135810.png"
                  alt="student"
                />
              </div>

              <div className="profile-main-info">
                <h2>{profile.name}</h2>

                <p>
                  <FaEnvelope className="mini-icon" />
                  {profile.email}
                </p>

                <p>
                  <FaPhoneAlt className="mini-icon" />
                  {profile.contact}
                </p>
              </div>
            </div>

            <div className="profile-actions">
              <Link
                to="/student-home/profile/attendenc-view"
                className="attendance-btn"
              >
                View Attendance
              </Link>

              <Link
                to="/student-home/profile/mark-view"
                className="attendance-btn"
              >
                Marks
              </Link>

              <Link to="/student-home/edit-profile" className="edit-btn">
                <FaUserEdit /> Edit Profile
              </Link>
            </div>
          </div>

          <div className="profile-section">
            <h3>Personal Information</h3>

            <div className="profile-grid">
              <div className="profile-item">
                <p className="profile-label">Gender</p>
                <span>{profile.gender}</span>
              </div>

              <div className="profile-item">
                <p className="profile-label">Date of Birth</p>
                <span>{profile.DOB}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Address Details</h3>

            <div className="profile-grid">
              <div className="profile-item">
                <p className="profile-label">City</p>
                <span>{profile.address.city}</span>
              </div>

              <div className="profile-item">
                <p className="profile-label">District</p>
                <span>{profile.address.district}</span>
              </div>

              <div className="profile-item">
                <p className="profile-label">State</p>
                <span>{profile.address.state}</span>
              </div>

              <div className="profile-item">
                <p className="profile-label">Pin</p>
                <span>{profile.address.pin}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loading">Loading Profile...</div>
      )}
    </div>
  );
};

export default ViewStudent;
