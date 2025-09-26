// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase'; // Firebase untouched
import './LoginPage.css'; // Your provided styles

export default function LoginPage() {
  // Firebase states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/bookmark'); // Redirect on success
    } catch (err) {
      setError(err.message);
      console.error('Login failed:', err);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email first.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
      console.error('Password reset failed:', err);
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

          {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
          {message && <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        {/* Forgot password link */}
        <p className="forgot-password-link">
          <button onClick={handleForgotPassword} className="link-button">
            Forgot Password?
          </button>
        </p>

        <p className="signup-link">
          Don&apos;t have an account yet?{' '}
          <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}