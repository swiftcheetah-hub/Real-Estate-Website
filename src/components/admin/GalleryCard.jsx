'use client'

import React from 'react'
import { Image as ImageIcon, Edit2, Trash2, Home, Building2, Video, Play } from 'lucide-react'

const GalleryCard = ({ galleryItem, onClick, isNew = false, onDelete }) => {
  if (isNew) {
    return (
      <div
        onClick={onClick}
        className="bg-dark-lighter rounded-xl p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 cursor-pointer transition-all hover:scale-105 min-h-[200px] flex flex-col items-center justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <ImageIcon className="w-10 h-10 text-primary" />
        </div>
        <div className="text-2xl font-bold text-primary mb-2">+</div>
        <div className="text-white font-semibold">Add New Gallery Item</div>
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
            onDelete(galleryItem)
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
          title="Delete Gallery Item"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Gallery Media */}
      <div className="relative h-48 overflow-hidden bg-dark">
        {galleryItem.mediaType === 'video' ? (
          <>
            {/* Video preview with image thumbnail if available */}
            {galleryItem.imageUrl ? (
              <img
                src={galleryItem.imageUrl}
                alt={galleryItem.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-dark">
                <Video className="w-16 h-16 text-primary" />
              </div>
            )}
            {/* Video play indicator */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
              </div>
            </div>
          </>
        ) : (
          <>
            {galleryItem.imageUrl ? (
              <img
                src={galleryItem.imageUrl}
                alt={galleryItem.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              className={`w-full h-full flex items-center justify-center ${
                galleryItem.imageUrl ? 'hidden' : ''
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-primary" />
              </div>
            </div>
          </>
        )}
        
        {/* Role Badge */}
        <div className="absolute top-2 left-2">
          <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
            galleryItem.role === 'Interior' 
              ? 'bg-blue-500/80 text-white' 
              : 'bg-green-500/80 text-white'
          }`}>
            {galleryItem.role}
          </div>
        </div>
        
        {/* Media Type Badge */}
        {galleryItem.mediaType === 'video' && (
          <div className="absolute top-2 right-2">
            <div className="px-2 py-1 rounded-lg bg-primary/80 text-black text-xs font-semibold flex items-center gap-1">
              <Video className="w-3 h-3" />
              Video
            </div>
          </div>
        )}
        
        {/* Edit Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center gap-2 text-white">
            <Edit2 className="w-5 h-5" />
            <span className="font-semibold">Edit Item</span>
          </div>
        </div>
      </div>

      {/* Gallery Item Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{galleryItem.name}</h3>
        <div className="flex items-center gap-2 text-sm text-primary">
          {galleryItem.role === 'Interior' ? (
            <Home className="w-4 h-4" />
          ) : (
            <Building2 className="w-4 h-4" />
          )}
          <span>{galleryItem.role}</span>
        </div>
      </div>
    </div>
  )
}

export default GalleryCard

