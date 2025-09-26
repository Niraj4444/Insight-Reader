// src/pages/BookReaderPage.jsx

import React, { useState, useEffect } from "react"; // ✅ THIS LINE IS NOW FIXED
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

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

  // --- START OF THE URL FIX ---
  let previewUrl = book.bookFileURL;
  let downloadUrl = book.bookFileURL;

  if (book.bookFileURL?.includes("drive.google.com")) {
    const match = book.bookFileURL.match(/\/d\/(.*?)(\/|$|\?)/);

    if (match && match[1]) {
      const fileId = match[1];
      // Create the correct URL for embedding in the iframe
      previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      // Create the correct URL for a direct download
      downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }
  // --- END OF THE URL FIX ---

  return (
    <div
      style={{
        height: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2>Reading: {book.title}</h2>

      {book.description && (
        <p style={{ marginTop: "8px", color: "#666", fontSize: "1rem" }}>
          {book.description}
        </p>
      )}

      {/* PDF Preview using the correct previewUrl */}
      <div style={{ flex: 1, marginTop: "20px" }}>
        <iframe
          src={previewUrl}
          title={book.title}
          width="100%"
          height="100%"
          style={{ border: "none" }}
          allow="autoplay"
        />
      </div>

      {/* Download button using the new downloadUrl */}
      <div className="flex flex-col items-center mt-6">
        <h3 className="text-xl font-semibold mb-3">Download Book</h3>
        <a
          href={downloadUrl}
          download={book.title || "book.pdf"}
          className="px-10 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-700 transition"
        >
          ⬇️ Download Book
        </a>
      </div>
    </div>
  );
}

export default BookReaderPage;