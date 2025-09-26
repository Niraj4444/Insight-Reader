import React from "react";
import { useAuth } from "../context/AuthContext";
import { addBookmark } from "../services/bookmarkService";

// ✅ Export localBooksData so SearchResultsPage can import
export const localBooksData = [
  {
    id: "house-dragon",
    image: "/images/Ice&f.jpg",
    alt: "House of the Dragon",
    title: "House of the Dragon Bundle",
    meta: "Free right now",
    description: "Enjoy the books from the popular series.",
  },
  {
    id: "fluent-python",
    image: "/images/Py3.jpg",
    alt: "Python Programming",
    title: "Fluent Python",
    meta: "Free for beginners",
    description: "Learn from the best-of-the-best books.",
  },
  {
    id: "lotr",
    image: "/images/rings.jpg",
    alt: "Lord of the Rings",
    title: "The Lord of the Rings",
    meta: "Classic Fantasy",
    description: "Epic fantasy adventure by J.R.R. Tolkien.",
  },
];

function Books({ searchQuery }) {
  const { currentUser } = useAuth();

  const handleBookmark = async (book) => {
    if (!currentUser) {
      alert("Please login to bookmark books.");
      return;
    }
    await addBookmark(currentUser.uid, book);
    alert(`${book.title} added to bookmarks!`);
  };

  const filteredBooks = searchQuery
    ? localBooksData.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : localBooksData;

  return (
    <>
      <div className="section">
        <h3>Books</h3>
        <h6>From enjoyable stories to serious learning materials.</h6>
      </div>

      <div className="grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div className="grid-half grid-column" key={book.id}>
              <div className="card">
                <img src={book.image} alt={book.alt} />
                <div className="card-content">
                  <h3>{book.title}</h3>
                  <p className="card-meta">{book.meta}</p>
                  <p>{book.description}</p>
                  <button className="btn btn-primary">View Book Details</button>
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