// src/components/Header.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [activeTab, setActiveTab] = useState("Books");
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/search?query=${encodeURIComponent(input)}`);
      setInput("");
    }
  };

  return (
    <header className="header-content position-relative">
      <img
        className="hero-image"
        src="/images/cover.jpg"
        alt="A library or a reading scene"
      />

      <div className="position-absolute-middle">
        <div className="tab-bar">
          <button
            className={`tab-link ${activeTab === "Books" ? "active" : ""}`}
            onClick={() => setActiveTab("Books")}
          >
            <i className="fas fa-book"></i> Books
          </button>
        </div>

        {activeTab === "Books" && (
          <div id="Books" className="tab-content" style={{ display: "block" }}>
            {/* ✅ Updated heading + text */}
            <h3 className="section-title">Search Your Next Read</h3>
            <p className="section-subtitle">
              Search our entire library by <strong>title</strong>, <strong>author</strong>, 
              <strong> description</strong> or <strong>category</strong>.
            </p>

            <form onSubmit={handleSearch}>
              <input
                className="form-input"
                type="text"
                placeholder="e.g., The World of Ice & Fire or George R.R. Martin"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <p>
                <button type="submit" className="btn btn-primary">
                  Search Books
                </button>
              </p>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;