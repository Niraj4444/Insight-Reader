import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import RatingStars from "../components/RatingStars";

function ReviewPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  // ✅ FIX HERE
  const { currentUser, loading: authLoading } = useAuth();

  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // -------------------------
  // Fetch Book + Existing Review
  // -------------------------
  useEffect(() => {
    if (authLoading) return; // wait for auth

    const fetchData = async () => {
      try {
        // 🔹 Fetch book
        const bookRef = doc(db, "books", bookId);
        const bookSnap = await getDoc(bookRef);

        if (!bookSnap.exists()) {
          setLoading(false);
          return;
        }

        setBook({ id: bookSnap.id, ...bookSnap.data() });

        // 🔹 Fetch existing review (if any)
        const reviewRef = doc(db, "books", bookId, "reviews", currentUser.uid);
        const reviewSnap = await getDoc(reviewRef);

        if (reviewSnap.exists()) {
          const data = reviewSnap.data();
          setRating(data.rating || 0);
          setReviewText(data.reviewText || "");
        }
      } catch (err) {
        console.error("Error loading review page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, currentUser, bookId]);

  // -------------------------
  // Submit Review
  // -------------------------
  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmitting(true);

    try {
      // 🔹 Save review
      await setDoc(
        doc(db, "books", bookId, "reviews", currentUser.uid),
        {
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email,
          rating,
          reviewText,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      // 🔹 Recalculate average rating
      const reviewsSnap = await getDocs(
        collection(db, "books", bookId, "reviews")
      );

      let total = 0;
      reviewsSnap.forEach((r) => {
        total += r.data().rating;
      });

      const avgRating = Number((total / reviewsSnap.size).toFixed(1));

      await setDoc(
        doc(db, "books", bookId),
        {
          avgRating,
          totalRatings: reviewsSnap.size,
        },
        { merge: true }
      );

      alert("Review submitted successfully!");
      navigate(`/read/${bookId}`);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading review page...</div>;
  if (!book) return <div>Book not found.</div>;

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2>Rate & Review</h2>
      <h3>{book.title}</h3>

      <div style={{ margin: "20px 0" }}>
        <RatingStars rating={rating} setRating={setRating} size={30} />
      </div>

      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review (optional)"
        rows={5}
        style={{ width: "100%", padding: "10px", borderRadius: "6px" }}
      />

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#ff9800",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {submitting ? "Saving..." : "Submit Review"}
      </button>
    </div>
  );
}

export default ReviewPage;