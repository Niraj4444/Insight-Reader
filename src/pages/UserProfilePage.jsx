// src/pages/UserProfilePage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../Digitalbook.css";

export default function UserProfilePage() {
  const { currentUser } = useAuth();

  // Use profile image if available, otherwise default logo
  const profileImage = currentUser?.photoURL || "/user.jpg";

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Avatar */}
        <img
          src={profileImage}
          alt="Profile"
          className="profile-avatar-img"
        />

        {/* Title */}
        <h1>{currentUser?.displayName || "User Profile"}</h1>
        <p>Manage your account information and reading insights.</p>

        {/* Info */}
        <div className="profile-info">
          <p>
            <span>Email:</span> {currentUser?.email}
          </p>
          <p>
            <span>Member Since:</span> 2025
          </p>
        </div>

        {/* Buttons */}
        <div className="profile-actions">
          <Link to="/contact" className="profile-btn profile-btn-primary">
            Contact Support
          </Link>
          <Link
            to="/insight-dashboard"
            className="profile-btn profile-btn-outline"
          >
            View Insights
          </Link>
        </div>

        {/* Footer */}
        <p className="profile-footer">Logged in as: {currentUser?.email}</p>
      </div>
    </div>
  );
}