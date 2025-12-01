'use client'

import React from 'react'
import { Home, Edit2, Trash2, Star, MapPin } from 'lucide-react'

const PropertyCard = ({ property, onClick, isNew = false, onDelete }) => {
  if (isNew) {
    return (
      <div
        onClick={onClick}
        className="bg-dark-lighter rounded-xl p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 cursor-pointer transition-all hover:scale-105 min-h-[200px] flex flex-col items-center justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Home className="w-10 h-10 text-primary" />
        </div>
        <div className="text-2xl font-bold text-primary mb-2">+</div>
        <div className="text-white font-semibold">Add New Property</div>
        <div className="text-gray-400 text-sm mt-1">Click to add</div>
      </div>
    )
  }

  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : null
  const price = property.price ? parseFloat(property.price) : 0

  return (
    <div
      onClick={onClick}
      className="bg-dark-lighter rounded-xl overflow-hidden border border-primary/20 hover:border-primary/40 cursor-pointer transition-all hover:scale-105 group relative"
    >
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden bg-dark">
        {mainImage ? (
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className={`w-full h-full flex items-center justify-center ${
            mainImage ? 'hidden' : ''
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <Home className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        {/* Featured Badge */}
        {property.isFeatured && (
          <div className="absolute top-2 left-2 bg-primary rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg z-10">
            <Star className="w-4 h-4 text-black fill-black" />
            <span className="text-black text-sm font-semibold">Featured</span>
          </div>
        )}

        {/* Delete Button - Top Right */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(property)
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
            title="Delete Property"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        )}
        
        {/* Edit Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center gap-2 text-white">
            <Edit2 className="w-5 h-5" />
            <span className="font-semibold">Edit Property</span>
          </div>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
          <div className="text-primary font-bold text-sm">
            ${price.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{property.title}</h3>
        {property.address && (
          <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{property.address}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-gray-400 text-xs">
          {property.bedrooms !== undefined && property.bedrooms !== null && (
            <span>{property.bedrooms} Beds</span>
          )}
          {property.bathrooms !== undefined && property.bathrooms !== null && (
            <span>{property.bathrooms} Baths</span>
          )}
          {property.area && (
            <span>{property.area.toLocaleString()} {property.areaUnit || 'sqft'}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertyCard

