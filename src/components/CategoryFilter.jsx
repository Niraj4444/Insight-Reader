// src/components/CategoryFilter.jsx
import React from "react";
import "./CategoryFilter.css"; // ✅ add this line

export default function CategoryFilter({ selected, categories, onChange }) {
  return (
    <div className="category-scroll">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`category-btn ${selected === cat ? "active" : ""}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}