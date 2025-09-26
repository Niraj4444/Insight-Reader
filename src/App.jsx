// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./Digitalbook.css";
import "./App.css";

import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Books from "./components/Books";
import Popularbooks from "./components/Popularbooks";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import SignupPage from "./pages/SignupPage";
import BookmarkPage from "./pages/BookmarkPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import BookReaderPage from "./pages/BookReaderPage";
import SearchResultsPage from "./pages/SearchResultsPage";  // ✅ real search page

// Homepage layout
function HomePage() {
  return (
    <>
      <Header />
      <div className="main-content">
        <Books searchQuery="" />
        <Popularbooks />
      </div>
    </>
  );
}

// Shared layout with navbar
function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} /> {/* ✅ fixed */}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/read/:bookId" element={<BookReaderPage />} />

            {/* Protected */}
            <Route
              path="/bookmark"
              element={
                <ProtectedRoute>
                  <BookmarkPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}