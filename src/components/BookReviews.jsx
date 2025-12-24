import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import RatingStars from "./RatingStars";

function BookReviews({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;

    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, "books", bookId, "reviews"),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setReviews(list);
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [bookId]);

  if (loading) return <p>Loading reviews...</p>;
  if (reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div style={{ marginTop: "24px" }}>
      <h3>⭐ Reader Reviews</h3>

      {reviews.map((r) => (
        <div
          key={r.id}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "12px 0",
          }}
        >
          <strong>{r.userName}</strong>
          <RatingStars rating={r.rating} setRating={() => {}} />
          {r.reviewText && <p>{r.reviewText}</p>}
        </div>
      ))}
    </div>
  );
}

export default BookReviews;