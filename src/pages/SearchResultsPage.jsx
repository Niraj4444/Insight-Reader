import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { addBookmark } from "../services/bookmarkService";

const fallbackImage = "/images/default-book.jpg";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const query = (useQuery().get("query") || "").toLowerCase().trim();
  const [firestoreBooks, setFirestoreBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

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

  // ✅ Search directly in Firestore books
  const results = firestoreBooks.filter((b) =>
    [b.title, b.description, b.category, b.meta]
      .map(normalize)
      .some((field) => field.includes(query))
  );

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

  if (loading) {
    return <div className="section">Loading search results...</div>;
  }

  return (
    <div className="section">
      <h2>Search Results for "{query}"</h2>
      {results.length > 0 ? (
        <div className="grid">
          {results.map((book) => (
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
                      <small className="category">{book.category}</small>
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
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
}

export default SearchResultsPage;