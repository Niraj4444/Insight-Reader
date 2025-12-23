// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // 🔐 Email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/bookmark");
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔑 Google login
  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/bookmark");
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔁 Forgot password
  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-card">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <p className="subtitle">Welcome back!</p>

          <div className="input-group">
            <span>📧</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span>🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {message && <p style={{ color: "green" }}>{message}</p>}

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        {/* 🔵 Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="login-btn"
          style={{
            background: "#fff",
            color: "#000",
            border: "1px solid #ccc",
            marginTop: "10px",
          }}
        >
          Continue with Google
        </button>

        <p className="forgot-password-link">
          <button onClick={handleForgotPassword} className="link-button">
            Forgot Password?
          </button>
        </p>

        <p className="signup-link">
          Don&apos;t have an account yet? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}