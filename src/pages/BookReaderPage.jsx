// src/pages/BookReaderPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Recommendations from "../components/Recommendations";
import NotesPanel from "../components/NotesPanel";

// Helper: Convert Nepali numerals to English (not used for iframe, kept untouched)
const nepaliToEnglishNumber = (text) => {
  if (!text) return "";
  const nepaliNums = ["०","१","२","३","४","५","६","७","८","९"];
  return text.replace(/[०-९]/g, (d) => nepaliNums.indexOf(d));
};

function BookReaderPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 NEW: Page-based reading progress state
  const [currentPage, setCurrentPage] = useState("");
  const [totalPages, setTotalPages] = useState("");

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
  // Track Reading History (UNCHANGED)
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

  // -------------------------
  // 🔹 NEW: Load saved page progress
  // -------------------------
  useEffect(() => {
    if (!currentUser || !bookId) return;

    const loadProgress = async () => {
      try {
        const ref = doc(
          db,
          "users",
          currentUser.uid,
          "readingProgress",
          bookId
        );

        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setCurrentPage(data.currentPage ?? "");
          setTotalPages(data.totalPages ?? "");
        }
      } catch (err) {
        console.error("Error loading reading progress:", err);
      }
    };

    loadProgress();
  }, [currentUser, bookId]);

  // -------------------------
  // 🔹 NEW: Save page-based progress
  // -------------------------
  const savePageProgress = async (page, total) => {
    if (!currentUser || !bookId || !total) return;

    const safePage = Math.max(0, Math.min(page, total));
    const progressPercent = Math.round((safePage / total) * 100);

    try {
      const ref = doc(
        db,
        "users",
        currentUser.uid,
        "readingProgress",
        bookId
      );

      await setDoc(
        ref,
        {
          bookId,
          currentPage: safePage,
          totalPages: total,
          progress: progressPercent,
          status: safePage >= total ? "completed" : "reading",
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving page progress:", err);
    }
  };

  if (loading) return <div>Loading book...</div>;
  if (!book) return <div>Book not found.</div>;

  // -------------------------
  // Google Drive Preview FIX (UNCHANGED)
  // -------------------------
  let previewUrl = book.bookFileURL;

  if (book.bookFileURL?.includes("drive.google.com")) {
    const match = book.bookFileURL.match(/\/d\/(.*?)(\/|$|\?)/);
    if (match && match[1]) {
      previewUrl = `https://drive.google.com/file/d/${match[1]}/preview?hl=en&embedded=true`;
    }
  }

  const percentage =
    totalPages > 0
      ? Math.round((Number(currentPage) / Number(totalPages)) * 100)
      : 0;

  return (
    <div
      style={{
        height: "120vh",
        display: "flex",
        gap: "20px",
        padding: "20px",
      }}
    >
      {/* LEFT: Book Info + Preview */}
      <div style={{ flex: 3, display: "flex", flexDirection: "column", height: "100%" }}>
        <h2>📖 Reading: {book.title}</h2>

        {typeof book.avgRating === "number" && (
          <p style={{ fontWeight: "500" }}>
            ⭐ {book.avgRating} ({book.totalRatings || 0} reviews)
          </p>
        )}

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

        {/* 🔹 NEW: Page-based Reading Progress UI */}
        <div
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <strong>Reading Progress</strong>

          <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
            <input
              type="number"
              min="0"
              placeholder="Current page"
              value={currentPage}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCurrentPage(value);
                savePageProgress(value, totalPages);
              }}
            />

            <input
              type="number"
              min="1"
              placeholder="Total pages"
              value={totalPages}
              onChange={(e) => {
                const value = Number(e.target.value);
                setTotalPages(value);
                savePageProgress(currentPage, value);
              }}
            />
          </div>

          {totalPages > 0 && (
            <p style={{ marginTop: "6px" }}>
              📊 {percentage}% completed ({currentPage}/{totalPages})
            </p>
          )}
        </div>

        <iframe
          src={previewUrl}
          title={book.title}
          width="100%"
          height="100%"
          style={{ border: "none", borderRadius: "10px", flex: 1 }}
          allow="autoplay"
        />
      </div>

      {/* RIGHT: Notes + Recommendations (UNCHANGED) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>
        <NotesPanel bookId={bookId} bookTitle={book.title} />
        <Recommendations currentBook={book} />
      </div>
    </div>
  );
}

export default BookReaderPage;