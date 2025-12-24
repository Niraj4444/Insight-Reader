import React from "react";
import { useAuth } from "../context/AuthContext";

function AuthReminder() {
  const { currentUser } = useAuth();

  // 🔒 If user is logged in, show nothing
  if (currentUser) return null;

  return (
    <div className="auth-reminder">
      <h3>🔐 Unlock more features</h3>
      <p>
        Sign Up or Login to access Insight Dashboard, save bookmarks,
        and track your reading progress.
      </p>
    </div>
  );
}

export default AuthReminder;