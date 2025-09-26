// src/pages/BookmarkPage.jsx
import React, { useEffect, useState } from "react";
import "../Digitalbook.css";
import { useAuth } from "../context/AuthContext";
import { getBookmarks, removeBookmark } from "../services/bookmarkService";
import { Link } from "react-router-dom";

const fallbackImage = "/images/default-book.jpg";

export default function BookmarkPage() {
  const { currentUser } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      const saved = await getBookmarks(currentUser.uid);
      setBookmarks(saved);
    };
    fetchData();
  }, [currentUser]);

  const handleRemove = async (bookId) => {
    await removeBookmark(currentUser.uid, bookId);
    setBookmarks((prev) => prev.filter((b) => b.id !== bookId));
  };

  if (!currentUser) {
    return (
      <div className="content-card">
        <h2>Please login</h2>
        <p>You need to login to view your bookmarks.</p>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>My Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <div className="grid">
          {bookmarks.map((book) => (
            <div className="grid-half grid-column" key={book.id}>
              <div className="card">
                {/* clickable card like PopularBooks */}
                <Link to={`/read/${book.id}`} className="book-card-link">
                  <div className="book-card">
                    <img
                      src={book.image || fallbackImage}
                      alt={book.title}
                      onError={(e) => (e.target.src = fallbackImage)}
                    />
                    <span className="position-absolute-bottom-left destination-name">
                      {book.title}
                      <br />
                      <small className="category">{book.category || book.meta}</small>
                    </span>
                  </div>
                </Link>

                {/* only remove button below card */}
                <button
                  className="btn btn-primary"
                  onClick={() => handleRemove(book.id)}
                >
                  Remove Bookmark
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}