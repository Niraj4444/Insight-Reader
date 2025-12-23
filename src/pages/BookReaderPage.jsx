// src/pages/BookReaderPage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Recommendations from "../components/Recommendations";
import NotesPanel from "../components/NotesPanel";

function BookReaderPage() {
  const { bookId } = useParams();
  const { user } = useAuth(); // ✅ logged-in user
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // Fetch Book (UNCHANGED)
  // -------------------------
  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const ref = doc(db, "books", bookId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setBook({ id: snap.id, ...snap.data() });
        } else {
          console.error("No such book in Firestore!");
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

  // ----------------------------------
  // 🔥 Track Reading History
  // ----------------------------------
  useEffect(() => {
    if (!user || !bookId || !book) return;

    const trackReading = async () => {
      try {
        console.log("Writing readingHistory for:", user.uid, bookId);

        const historyId = `${user.uid}_${bookId}`;
        const historyRef = doc(db, "readingHistory", historyId);

        await setDoc(
          historyRef,
          {
            userId: user.uid,
            bookId: bookId,
            bookTitle: book.title,
            startedAt: serverTimestamp(),
            lastReadAt: serverTimestamp(),
            status: "reading",
          },
          { merge: true } // ✅ SAFE: never overwrites existing data
        );
      } catch (error) {
        console.error("Error tracking reading history:", error);
      }
    };

    trackReading();
  }, [user, bookId, book]);

  if (loading) return <div>Loading book...</div>;
  if (!book) return <div>Book not found.</div>;

  // --- Google Drive URL Fix (UNCHANGED) ---
  let previewUrl = book.bookFileURL;
  let downloadUrl = book.bookFileURL;

  if (book.bookFileURL?.includes("drive.google.com")) {
    const match = book.bookFileURL.match(/\/d\/(.*?)(\/|$|\?)/);

    if (match && match[1]) {
      const fileId = match[1];
      previewUrl = `https://drive.google.com/file/d/${fileId}/preview?hl=en`;
      downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }
  // --- END ---

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        padding: "20px",
      }}
    >
      {/* LEFT: Book Info + Preview */}
      <div
        style={{
          flex: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>
          Reading: {book.title}
        </h2>

        {book.description && (
          <p className="book-description">
            {book.description}
          </p>
        )}

        <iframe
          src={previewUrl}
          title={book.title}
          width="100%"
          height="100%"
          style={{ border: "none", borderRadius: "10px", flex: 1 }}
          allow="autoplay"
        />
      </div>

      {/* RIGHT: Notes + Recommendations */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          overflowY: "auto",
        }}
      >
        <NotesPanel bookId={bookId} bookTitle={book.title} />
        <Recommendations currentBook={book} />
      </div>
    </div>
  );
}

export default BookReaderPage;