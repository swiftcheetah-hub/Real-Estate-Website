'use client'

import React from 'react'
import { Calendar, Edit2, Trash2 } from 'lucide-react'

const JourneyCard = ({ journey, onClick, isNew = false, onDelete }) => {
  if (isNew) {
    return (
      <div
        onClick={onClick}
        className="bg-dark-lighter rounded-xl p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 cursor-pointer transition-all hover:scale-105 min-h-[200px] flex flex-col items-center justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Calendar className="w-10 h-10 text-primary" />
        </div>
        <div className="text-2xl font-bold text-primary mb-2">+</div>
        <div className="text-white font-semibold">Add New Milestone</div>
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
            onDelete(journey)
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
          title="Delete Milestone"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Journey Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-primary">{journey.year}</div>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2">{journey.title}</h3>
        
        {journey.description && (
          <p className="text-sm text-gray-400 line-clamp-3">{journey.description}</p>
        )}

        {/* Edit Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center gap-2 text-white">
            <Edit2 className="w-5 h-5" />
            <span className="font-semibold">Edit Milestone</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JourneyCard

