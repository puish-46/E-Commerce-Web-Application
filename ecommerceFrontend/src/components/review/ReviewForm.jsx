import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const ReviewForm = ({ onSubmit, initialData = null, onCancel = null }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating);
      setComment(initialData.comment);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a rating');
    
    onSubmit({ rating, comment });
    
    if (!initialData) {
      setRating(0);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {initialData ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
        <div className="flex gap-1 cursor-pointer">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-2xl ${
                (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
              } transition-colors`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
        <textarea
          id="comment"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like or dislike? What did you use this product for?"
          className="block w-full rounded-md shadow-sm sm:text-sm px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          required
        ></textarea>
      </div>
      
      <div className="flex gap-3">
        <Button type="submit">
          {initialData ? 'Update Review' : 'Submit Review'}
        </Button>
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
