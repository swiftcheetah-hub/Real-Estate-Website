'use client'

import React from 'react'
import { User, Edit2, Trash2, TrendingUp } from 'lucide-react'

const InvestorCard = ({ investor, onClick, isNew = false, onDelete }) => {
  if (isNew) {
    return (
      <div
        onClick={onClick}
        className="bg-dark-lighter rounded-xl p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 cursor-pointer transition-all hover:scale-105 min-h-[200px] flex flex-col items-center justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <TrendingUp className="w-10 h-10 text-primary" />
        </div>
        <div className="text-2xl font-bold text-primary mb-2">+</div>
        <div className="text-white font-semibold">Add New Investor</div>
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
            onDelete(investor)
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
          title="Delete Investor"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Investor Image */}
      <div className="relative h-48 overflow-hidden bg-dark">
        {investor.imageUrl ? (
          <img
            src={investor.imageUrl}
            alt={investor.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className={`w-full h-full flex items-center justify-center ${
            investor.imageUrl ? 'hidden' : ''
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        {/* Edit Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center gap-2 text-white">
            <Edit2 className="w-5 h-5" />
            <span className="font-semibold">Edit Investor</span>
          </div>
        </div>
      </div>

      {/* Investor Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{investor.name}</h3>
        {investor.role && (
          <p className="text-sm text-primary mb-2">{investor.role}</p>
        )}
        {investor.testimonial && (
          <p className="text-xs text-gray-400 line-clamp-2">{investor.testimonial}</p>
        )}
      </div>
    </div>
  )
}

export default InvestorCard

