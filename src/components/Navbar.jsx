// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext.jsx'; // make sure path is correct
import { auth } from '../firebase';

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="navbar">
      {/* Brand logo */}
      <Link to="/" className="brand-logo">
        Insight Reader
      </Link>

      <div className="navbar-actions">
        {currentUser ? (
          <>
            {/* Logged-in links */}
            <Link to="/bookmark" className="nav-link">
              Bookmark
            </Link>
            <Link to="/user" className="nav-link">
              User
            </Link>
            <button onClick={handleLogout} className="btn-primary-nav">
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Logged-out links */}
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup">
              <button className="btn-primary-nav">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}