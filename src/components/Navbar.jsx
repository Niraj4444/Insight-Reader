// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext.jsx';
import { auth } from '../firebase';

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // ⭐ Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

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
      <Link to="/" className="brand-logo">
        Insight Reader
      </Link>

      <div className="navbar-actions">
        {currentUser ? (
          <>
            <Link to="/bookmark" className="nav-link">
              Bookmark
            </Link>

            {/* ✅ New Reading History Link */}
            <Link to="/history" className="nav-link">
              Reading History
            </Link>

            <Link to="/insight-dashboard" className="nav-link">
              Insight Dashboard
            </Link>

            <Link to="/all-books" className="nav-link">
              All Books
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
            <Link to="/all-books" className="nav-link">
              All Books
            </Link>

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

        {/* 🌗 Sun/Moon Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}