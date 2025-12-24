import { FaStar } from "react-icons/fa";

const RatingStars = ({ rating, setRating, size = 24 }) => {
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={size}
          color={star <= rating ? "#ffc107" : "#e4e5e9"}
          style={{ cursor: "pointer" }}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

export default RatingStars;