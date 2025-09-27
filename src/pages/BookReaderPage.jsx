// src/pages/BookReaderPage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Recommendations from "../components/Recommendations";

function BookReaderPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading book...</div>;
  if (!book) return <div>Book not found.</div>;

  // --- START: Google Drive URL Fix ---
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
  // --- END: Google Drive URL Fix ---

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
      <div style={{ flex: 3, height: "100%", display: "flex", flexDirection: "column" }}>
        <h2 style={{ marginBottom: "10px" }}>Reading: {book.title}</h2>

        {/* ✅ Book description */}
        {book.description && (
          <p style={{ marginBottom: "15px", color: "#444", fontSize: "1rem" }}>
            {book.description}
          </p>
        )}

        {/* PDF Preview */}
        <iframe
          src={previewUrl}
          title={book.title}
          width="100%"
          height="100%"
          style={{ border: "none", borderRadius: "10px", flex: 1 }}
          allow="autoplay"
        />
      </div>

      {/* RIGHT: Download + Recommendations */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          overflowY: "auto",
        }}
      >
        {/* Download Section */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-3">Download Book</h3>
          <a
            href={downloadUrl}
            download={book.title || "book.pdf"}
            className="px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-700 transition"
          >
            ⬇️ Download Book
          </a>
        </div>

        {/* Recommendations */}
        <Recommendations currentBook={book} />
      </div>
    </div>
  );
}

export default BookReaderPage;