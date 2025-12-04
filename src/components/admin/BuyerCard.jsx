'use client'

import React from 'react'
import { User, Edit2, Trash2, MapPin, DollarSign } from 'lucide-react'

const BuyerCard = ({ buyer, onClick, isNew = false, onDelete }) => {
  if (isNew) {
    return (
      <div
        onClick={onClick}
        className="bg-dark-lighter rounded-xl p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 cursor-pointer transition-all hover:scale-105 min-h-[200px] flex flex-col items-center justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-primary" />
        </div>
        <div className="text-2xl font-bold text-primary mb-2">+</div>
        <div className="text-white font-semibold">Add New Buyer</div>
        <div className="text-gray-400 text-sm mt-1">Click to add</div>
      </div>
    )
  }

  const getInitials = (fullName) => {
    if (!fullName) return 'N/A'
    const parts = fullName.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return fullName.substring(0, 2).toUpperCase()
  }

  const initials = getInitials(buyer.fullName)
  const buyerTypeColors = {
    'First Home Buyer': 'bg-green-600',
    'Upgrade Home Buyer': 'bg-blue-600',
    'Holding Investor': 'bg-yellow-600',
    'Developer': 'bg-orange-600',
    'Do Up': 'bg-pink-600',
    'Downgrade Home Buyer': 'bg-purple-600',
  }
  const buyerTypeColor = buyerTypeColors[buyer.buyerType] || 'bg-gray-600'

  return (
    <div
      onClick={onClick}
      className="relative bg-dark-lighter rounded-xl overflow-hidden border border-primary/20 hover:border-primary/40 cursor-pointer transition-all hover:scale-105 group"
    >
      {/* Header */}
      <div className="p-4 bg-dark">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xl">{initials}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{initials}</h3>
            <p className="text-xs text-gray-400">
              {new Date(buyer.createdAt).toLocaleDateString()}
            </p>
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(buyer)
              }}
              className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
              title="Delete Buyer"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Buyer Type Badge */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${buyerTypeColor}`}>
            {buyer.buyerType}
          </span>
          {buyer.preApproved && (
            <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-medium">
              Pre-Approved
            </span>
          )}
          {!buyer.isActive && (
            <span className="px-3 py-1 rounded-full bg-gray-600 text-white text-xs font-medium">
              Inactive
            </span>
          )}
        </div>
      </div>

      {/* Buyer Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-gray-300">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">{buyer.budgetRange}</span>
        </div>
        {buyer.preferredSuburbs && (
          <div className="flex items-start gap-2 text-gray-300">
            <MapPin className="w-4 h-4 text-primary mt-0.5" />
            <span className="text-xs line-clamp-2">{buyer.preferredSuburbs}</span>
          </div>
        )}
        {buyer.bedrooms && buyer.bathrooms && (
          <div className="text-xs text-gray-400">
            {buyer.bedrooms} bed • {buyer.bathrooms} bath
            {buyer.garage && ` • ${buyer.garage} garage`}
          </div>
        )}
      </div>

      {/* Edit Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-2 text-white">
          <Edit2 className="w-5 h-5" />
          <span className="font-semibold">Edit Buyer</span>
        </div>
      </div>
    </div>
  )
}

export default BuyerCard

