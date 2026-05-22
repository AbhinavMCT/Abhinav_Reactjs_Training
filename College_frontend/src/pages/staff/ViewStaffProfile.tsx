import { useEffect, useState } from "react";
import { FaUserEdit, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

import { getProfile } from "../../services/StaffApi.ts";
import { ProfileData } from "../../types/Datatypes.ts";

import "../../styles/student/viewStudent.css";
import { Link } from "react-router-dom";

const ViewStaff = () => {

  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await getProfile();

        setProfile(res.data);

      } catch (error) {

        console.error(
          "Error fetching profile:",
          error
        );

      }
    };

    fetchProfile();

  }, []);

  return (
    <div className="student-profile-container">

      {profile ? (

        <div className="student-profile-card">

          {/* Top Banner */}
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

            <Link to="/staff/edit-profile" className="edit-btn">
              <FaUserEdit /> Edit Profile
            </Link>

          </div>

          {/* Personal Information */}
          <div className="profile-section">

            <h3>Personal Information</h3>

            <div className="profile-grid">

              <div className="profile-item">
                <label>Gender</label>
                <span>{profile.gender}</span>
              </div>

              <div className="profile-item">
                <label>Date of Birth</label>
                <span>{profile.DOB}</span>
              </div>

            </div>

          </div>

          {/* Address Information */}
          <div className="profile-section">

            <h3>Address Details</h3>

            <div className="profile-grid">

              <div className="profile-item">
                <label>City</label>
                <span>{profile.address.city}</span>
              </div>

              <div className="profile-item">
                <label>District</label>
                <span>{profile.address.district}</span>
              </div>

              <div className="profile-item">
                <label>State</label>
                <span>{profile.address.state}</span>
              </div>

              <div className="profile-item">
                <label>Pin</label>
                <span>{profile.address.pin}</span>
              </div>

            </div>

          </div>

        </div>

      ) : (

        <div className="loading">
          Loading Profile...
        </div>

      )}

    </div>
  );
};

export default ViewStaff;