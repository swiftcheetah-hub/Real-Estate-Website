'use client'

import React from 'react'
import { User, Edit2, Trash2, Star, Quote } from 'lucide-react'

const ReviewCard = ({ review, onClick, isNew = false, onDelete }) => {
  if (isNew) {
    return (
      <div
        onClick={onClick}
        className="bg-dark-lighter rounded-xl p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 cursor-pointer transition-all hover:scale-105 min-h-[200px] flex flex-col items-center justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Quote className="w-10 h-10 text-primary" />
        </div>
        <div className="text-2xl font-bold text-primary mb-2">+</div>
        <div className="text-white font-semibold">Add New Review</div>
        <div className="text-gray-400 text-sm mt-1">Click to add</div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="bg-dark-lighter rounded-xl overflow-hidden border border-primary/20 hover:border-primary/40 cursor-pointer transition-all hover:scale-105 group relative"
    >
      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(review)
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
          title="Delete Review"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Quote Icon */}
      <div className="absolute top-4 right-4 opacity-20">
        <Quote className="w-12 h-12 text-primary" />
      </div>

      {/* Review Content */}
      <div className="p-6">
        {/* Client Info */}
        <div className="flex items-center gap-4 mb-4">
          {review.imageUrl ? (
            <img
              src={review.imageUrl}
              alt={review.name}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          <div
            className={`w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center ${
              review.imageUrl ? 'hidden' : ''
            }`}
          >
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="font-semibold text-white">{review.name}</div>
            {review.role && (
              <div className="text-sm text-gray-400">{review.role}</div>
            )}
          </div>
        </div>

        {/* Rating */}
        {review.rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(review.rating || 5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
        )}

        {/* Review Text */}
        {review.text && (
          <p className="text-white text-sm mb-3 line-clamp-3 leading-relaxed">{review.text}</p>
        )}

        {/* Property */}
        {review.property && (
          <div className="text-xs text-gray-400 mb-1">{review.property}</div>
        )}

        {/* Agent */}
        {review.agentName && (
          <div className="text-xs text-primary font-medium">Agent: {review.agentName}</div>
        )}

        {/* Edit Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center gap-2 text-white">
            <Edit2 className="w-5 h-5" />
            <span className="font-semibold">Edit Review</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard

