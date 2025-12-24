import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

function ReviewsList({ bookId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!bookId) return;

    const reviewsRef = collection(db, "books", bookId, "reviews");

    const unsub = onSnapshot(reviewsRef, (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(list);
    });

    return () => unsub();
  }, [bookId]);

  if (reviews.length === 0) {
    return <p>No reviews yet. Be the first to review!</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>⭐ Reviews</h3>

      {reviews.map((r) => (
        <div
          key={r.id}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "10px 0",
          }}
        >
          <strong>{r.userName}</strong>
          <div>Rating: ⭐ {r.rating}</div>
          {r.reviewText && <p>{r.reviewText}</p>}
        </div>
      ))}
    </div>
  );
}

export default ReviewsList;