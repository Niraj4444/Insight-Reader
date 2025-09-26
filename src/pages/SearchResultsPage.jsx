import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// ✅ Import localBooksData from Books.jsx
import { localBooksData } from "../components/Books";

const fallbackImage = "/images/default-book.jpg";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const query = (useQuery().get("query") || "").toLowerCase().trim();
  const [firestoreBooks, setFirestoreBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollectionRef = collection(db, "books");
        const snapshot = await getDocs(booksCollectionRef);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFirestoreBooks(list);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const normalize = (str) => (str || "").toLowerCase().trim();

  // ✅ Merge both local + Firestore
  const allBooks = [...localBooksData, ...firestoreBooks];

  // ✅ Search in title, description, category, meta
  const results = allBooks.filter((b) =>
    [b.title, b.description, b.category, b.meta]
      .map(normalize)
      .some((field) => field.includes(query))
  );

  if (loading) {
    return <div className="section">Loading search results...</div>;
  }

  return (
    <div className="section">
      <h2>Search Results for "{query}"</h2>
      {results.length > 0 ? (
        <div className="grid">
          {results.map((book, i) =>
            book.id && !book.localOnly ? (
              // Firestore PopularBooks
              <div className="grid-half grid-column" key={`fs-${book.id}`}>
                <Link to={`/read/${book.id}`} className="book-card-link">
                  <div className="book-card">
                    <img
                      src={book.coverImageURL || fallbackImage}
                      alt={book.title}
                      onError={(e) => (e.target.src = fallbackImage)}
                    />
                    <span className="position-absolute-bottom-left destination-name">
                      {book.title}
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              // Local Books.jsx
              <div className="grid-half grid-column" key={`st-${book.id || i}`}>
                <div className="book-card">
                  <img
                    src={book.image || fallbackImage}
                    alt={book.title}
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                  <span className="position-absolute-bottom-left destination-name">
                    {book.title}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
}

export default SearchResultsPage;