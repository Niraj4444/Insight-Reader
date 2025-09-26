// src/components/Books.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { addBookmark } from "../services/bookmarkService";
import CategoryFilter from "./CategoryFilter"; // ✅ import CategoryFilter

const fallbackImage = "/images/default-book.jpg";

function Books({ searchQuery }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All"); // ✅ category state
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollectionRef = collection(db, "books");
        const querySnapshot = await getDocs(booksCollectionRef);
        const booksList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          category: "Uncategorized", // default
          ...doc.data(),
        }));
        setBooks(booksList);
      } catch (error) {
        console.error("Error fetching books: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
    return <div className="section">Loading books...</div>;
  }

  // ✅ Filter by search query
  let filteredBooks = searchQuery
    ? books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : books;

  // ✅ Filter by selected category
  filteredBooks =
    selectedCategory === "All"
      ? filteredBooks
      : filteredBooks.filter((book) => book.category === selectedCategory);

  // ✅ Extract unique categories
  const categories = ["All", ...new Set(books.map((b) => b.category || "Uncategorized"))];

  return (
    <>
      <div className="section">
        <h3>Books</h3>
        <h6>From enjoyable stories to serious learning materials.</h6>
      </div>

      {/* ✅ Category filter */}
      <CategoryFilter
        selected={selectedCategory}
        categories={categories}
        onChange={setSelectedCategory}
      />

      <div className="grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
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
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </>
  );
}

export default Books;