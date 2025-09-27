// src/components/Recommendations.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Recommendations({ currentBook }) {
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!currentBook) return;

      const snapshot = await getDocs(collection(db, "books"));
      const books = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const sims = books
        .filter((b) => b.id !== currentBook.id)
        .map((b) => {
          let score = 0;

          // ✅ Priority 1: same author
          if (
            b.author?.toLowerCase() === currentBook.author?.toLowerCase()
          ) {
            score += 2; // strong weight
          }

          // ✅ Priority 2: same category
          if (
            b.category?.toLowerCase() === currentBook.category?.toLowerCase()
          ) {
            score += 1; // medium weight
          }

          return { ...b, score };
        })
        .filter((b) => b.score > 0); // only keep books with similarity

      sims.sort((a, b) => b.score - a.score);
      setRecommended(sims.slice(0, 3));
    };

    fetchBooks();
  }, [currentBook]);

  if (!recommended.length) return null;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 className="text-2xl font-bold mb-4">Recommended Books</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {recommended.map((book) => (
          <div
            key={book.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              width: "200px",
              textAlign: "center",
            }}
          >
            <img
              src={book.coverImageURL}
              alt={book.title}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <p className="font-semibold mt-2">{book.title}</p>
            <p className="text-sm text-gray-600">{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}