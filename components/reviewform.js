import { useState } from "react";

export default function ReviewForm({ userId, username }) {
  const [reviewerId, setReviewerId] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate form data
    if (!reviewerId || !rating || !comment) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewerId, rating, comment }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit review.");
      }

      setSuccess("Review submitted successfully!");
      setReviewerId("");
      setRating(1);
      setComment("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">How was your experience working with {username}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Reviewer ID Input */}
        <div>
          <label htmlFor="reviewerId" className="block text-sm font-medium text-gray-200">
            Your unername
          </label>
          <input
            type="email"
            id="reviewerId"
            value={reviewerId}
            onChange={(e) => setReviewerId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Rating Input */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-200">
            Rating (1-5)
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value={1}>1 - Poor</option>
            <option value={2}>2 - Fair</option>
            <option value={3}>3 - Good</option>
            <option value={4}>4 - Very Good</option>
            <option value={5}>5 - Excellent</option>
          </select>
        </div>

        {/* Comment Input */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-200">
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Write your review here..."
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
      </form>
    </div>
  );
}