// src/components/Recommendations.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addBookmark } from "../services/bookmarkService";

const fallbackImage = "/images/default-book.jpg";

export default function Recommendations({ currentBook }) {
  const [recommended, setRecommended] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      if (!currentBook) return;

      const snapshot = await getDocs(collection(db, "books"));
      const books = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const sims = books
        .filter((b) => b.id !== currentBook.id)
        .map((b) => {
          let score = 0;

          // Convert seriesOrder to numbers for correct comparison
          const bOrder = Number(b.seriesOrder);
          const currOrder = Number(currentBook.seriesOrder);

          // ✅ Priority 1: Same series
          if (b.series?.toLowerCase() === currentBook.series?.toLowerCase()) {
            if (!isNaN(bOrder) && !isNaN(currOrder)) {
              if (bOrder === currOrder + 1) {
                score += 10; // next book in the series
              } else if (bOrder === currOrder - 1) {
                score += 7; // previous book in the series
              } else {
                score += 5; // same series, other part
              }
            } else {
              score += 3; // same series but missing order info
            }
          }

          // ✅ Priority 2: same author
          if (
            b.author?.toLowerCase() === currentBook.author?.toLowerCase()
          ) {
            score += 3;
          }

          // ✅ Priority 3: same category
          if (
            b.category?.toLowerCase() === currentBook.category?.toLowerCase()
          ) {
            score += 1;
          }

          return { ...b, score };
        })
        .filter((b) => b.score > 0);

      // Sort by score (highest first)
      sims.sort((a, b) => b.score - a.score);

      // Show top 3 recommendations
      setRecommended(sims.slice(0, 3));
    };

    fetchBooks();
  }, [currentBook]);

  const handleBookmark = async (book) => {
    if (!currentUser) {
      alert("Please login to bookmark books.");
      return;
    }

    const bookmarkData = {
      id: book.id,
      title: book.title,
      image: book.coverImageURL || fallbackImage,
      description: book.description || "No description available.",
      meta: book.meta || "Book",
      category: book.category || "Uncategorized",
    };

    await addBookmark(currentUser.uid, bookmarkData);
    alert(`${book.title} added to bookmarks!`);
  };

  if (!recommended.length) return null;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 className="text-2xl font-bold mb-4">Recommended Books</h2>
      <div className="grid">
        {recommended.map((book) => (
          <div className="grid-half grid-column" key={book.id}>
            <div className="card">
              <Link to={`/read/${book.id}`} className="book-card-link">
                <div className="book-card">
                  <img
                    src={book.coverImageURL || fallbackImage}
                    alt={book.title}
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                  <span className="position-absolute-bottom-left destination-name">
                    {book.title}
                    <br />
                    <small className="category">
                      {book.category || "Uncategorized"}
                    </small>
                  </span>
                </div>
              </Link>

              {currentUser && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleBookmark(book)}
                >
                  Bookmark
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}