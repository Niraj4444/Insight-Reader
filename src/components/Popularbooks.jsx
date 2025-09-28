// src/components/Popularbooks.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addBookmark } from "../services/bookmarkService";
import CategoryFilter from "./CategoryFilter";

const fallbackImage = "/images/default-book.jpg";

function Popularbooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollectionRef = collection(db, "books");
        const querySnapshot = await getDocs(booksCollectionRef);
        const booksList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          popular: false, // default if missing
          category: "Uncategorized", // default category
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

  // ✅ Filter only popular books and by selected category
  const filteredBooks = books.filter(
    (book) =>
      book.popular &&
      (selectedCategory === "All" || book.category === selectedCategory)
  );

  // ✅ Extract unique categories
  const categories = ["All", ...new Set(books.map((b) => b.category || "Uncategorized"))];

  return (
    <>
      <div className="section section-margin-top">
        <h3>Popular Books</h3>
        <p>Explore all the books you can think of.</p>
      </div>

      <CategoryFilter
        selected={selectedCategory}
        categories={categories}
        onChange={setSelectedCategory}
      />

      <div className="grid">
        {filteredBooks.map((book) => (
          <div className="card" key={book.id}>
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
        ))}
      </div>
    </>
  );
}

export default Popularbooks;