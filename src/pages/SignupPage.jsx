// src/pages/SignUpPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";
import "./SignUpPage.css";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 📧 Email + password signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        bookmarks: [],
        provider: "password",
      });

      navigate("/bookmark");
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔑 Google signup / login
  const handleGoogleSignup = async () => {
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // Create Firestore user only if not exists
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          bookmarks: [],
          provider: "google",
        });
      }

      navigate("/bookmark");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-form-card">
        <form onSubmit={handleSignUp}>
          <h2>Create Account</h2>
          <p className="subtitle">Join our community today!</p>

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

          <div className="input-group">
            <span>🔒</span>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        {/* 🔴 Google Signup Button */}
        <button
          onClick={handleGoogleSignup}
          className="google-login-btn"
        >
          Continue with Google
        </button>

        <p className="login-link">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
}