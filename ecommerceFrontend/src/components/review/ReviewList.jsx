import React, { useState } from 'react';
import StarRating from '../ui/StarRating';
import Button from '../ui/Button';

const ReviewList = ({ reviews, currentUser, onEdit, onDelete }) => {
  return (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  {review.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{review.user?.name || 'Anonymous User'}</h4>
                  <p className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <StarRating rating={review.rating} size="sm" />
                
                {currentUser && currentUser._id === review.user?._id && (
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => onEdit(review)}
                      className="text-xs text-teal-600 hover:text-teal-800 font-medium"
                    >
                      Edit
                    </button>
                    <span className="text-gray-300">|</span>
                    <button 
                      onClick={() => onDelete(review._id)}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 mt-3">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
