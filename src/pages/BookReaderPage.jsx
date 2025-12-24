// src/pages/BookReaderPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Recommendations from "../components/Recommendations";
import NotesPanel from "../components/NotesPanel";

function BookReaderPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // Fetch Book
  // -------------------------
  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) {
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, "books", bookId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setBook({ id: snap.id, ...snap.data() });
        } else {
          setBook(null);
        }
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  // -------------------------
  // Track Reading History
  // -------------------------
  useEffect(() => {
    if (!currentUser || !bookId || !book) return;

    const trackReading = async () => {
      try {
        const historyId = `${currentUser.uid}_${bookId}`;
        const historyRef = doc(db, "readingHistory", historyId);

        await setDoc(
          historyRef,
          {
            userId: currentUser.uid,
            bookId,
            bookTitle: book.title,
            lastReadAt: serverTimestamp(),
            status: "reading",
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error tracking reading history:", error);
      }
    };

    trackReading();
  }, [currentUser, bookId, book]);

  if (loading) return <div>Loading book...</div>;
  if (!book) return <div>Book not found.</div>;

  // -------------------------
  // Google Drive Preview Fix
  // -------------------------
  let previewUrl = book.bookFileURL;

  if (book.bookFileURL?.includes("drive.google.com")) {
    const match = book.bookFileURL.match(/\/d\/(.*?)(\/|$|\?)/);
    if (match && match[1]) {
      previewUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }

  return (
    <div style={{ height: "100vh", display: "flex", gap: "20px", padding: "20px" }}>
      {/* LEFT */}
      <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
        <h2>📖 Reading: {book.title}</h2>

        {/* ⭐ Average Rating */}
        {typeof book.avgRating === "number" && (
          <p style={{ fontWeight: "500" }}>
            ⭐ {book.avgRating} ({book.totalRatings || 0} reviews)
          </p>
        )}

        {/* ⭐ Rate & Review Button */}
        <button
          onClick={() => navigate(`/review/${bookId}`)}
          style={{
            marginBottom: "12px",
            padding: "6px 14px",
            backgroundColor: "#ffb300",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          ⭐ Rate & Review
        </button>

        {book.description && <p>{book.description}</p>}

        {/* 📄 Book Preview */}
        <iframe
          src={previewUrl}
          title={book.title}
          width="100%"
          height="100%"
          style={{ border: "none", borderRadius: "10px", flex: 1, marginTop: "10px" }}
          allow="autoplay"
        />
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        <NotesPanel bookId={bookId} bookTitle={book.title} />
        <Recommendations currentBook={book} />
      </div>
    </div>
  );
}

export default BookReaderPage;