// src/pages/AllBooksPage.jsx
import React from "react";
import Books from "../components/Books";

export default function AllBooksPage() {
  return (
    <div className="main-content">
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>All Books</h2>
      <Books searchQuery="" />
    </div>
  );
}