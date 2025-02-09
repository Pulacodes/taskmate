'use client';

import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';

// Star Rating Component (unchanged)
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          fill={index < rating ? 'gold' : 'none'}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-5 h-5 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.048 2.927c.3-.921 1.604-.921 1.902 0l2.043 6.254a1 1 0 00.95.69h6.454c.969 0 1.371 1.24.588 1.81l-5.225 3.79a1 1 0 00-.364 1.118l2.043 6.254c.3.921-.755 1.688-1.538 1.118l-5.225-3.79a1 1 0 00-1.175 0l-5.225 3.79c-.783.57-1.838-.197-1.538-1.118l2.043-6.254a1 1 0 00-.364-1.118L2.913 11.68c-.783-.57-.38-1.81.588-1.81h6.454a1 1 0 00.95-.69l2.043-6.254z"
          />
        </svg>
      ))}
    </div>
  );
};

export default function Reviews({ userId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`/api/reviews/${userId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error('Error fetching reviews:', err));
  }, [userId]);

  if (reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  // Calculate average rating
  const averageRating = 
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(averageRating)} />
          <span className="text-gray-600">
            {averageRating.toFixed(1)}/5
          </span>
        </div>
      </div>

    
  );
}