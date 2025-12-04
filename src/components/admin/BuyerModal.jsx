'use client'

import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'

const buyerTypes = [
  'First Home Buyer',
  'Upgrade Home Buyer',
  'Downgrade Home Buyer',
  'Holding Investor',
  'Developer',
  'Do Up',
]

const budgetRanges = [
  '$500k - $600k',
  '$600k - $700k',
  '$700k - $800k',
  '$800k - $900k',
  '$900k - $1M',
  '$1M - $1.2M',
  '$1.2M - $1.3M',
  '$1.3M - $1.5M',
  '$1.5M - $2M',
  '$2M - $3M',
  '$3M+',
]

const landSizes = [
  'Less than 500 m²',
  '500-700 m²',
  '700-1000 m²',
  '1000+ m²',
]

const BuyerModal = ({ isOpen, onClose, buyer = null, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    buyerType: '',
    budgetRange: '',
    bedrooms: '',
    bathrooms: '',
    garage: '',
    preferredSuburbs: '',
    landSize: '',
    additionalPreferences: '',
    preApproved: false,
    isActive: true,
  })

  const isEditMode = !!buyer

  useEffect(() => {
    if (isOpen) {
      if (buyer) {
        setFormData({
          fullName: buyer.fullName || '',
          email: buyer.email || '',
          phone: buyer.phone || '',
          buyerType: buyer.buyerType || '',
          budgetRange: buyer.budgetRange || '',
          bedrooms: buyer.bedrooms || '',
          bathrooms: buyer.bathrooms || '',
          garage: buyer.garage || '',
          preferredSuburbs: buyer.preferredSuburbs || '',
          landSize: buyer.landSize || '',
          additionalPreferences: buyer.additionalPreferences || '',
          preApproved: buyer.preApproved || false,
          isActive: buyer.isActive !== undefined ? buyer.isActive : true,
        })
      } else {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          buyerType: '',
          budgetRange: '',
          bedrooms: '',
          bathrooms: '',
          garage: '',
          preferredSuburbs: '',
          landSize: '',
          additionalPreferences: '',
          preApproved: false,
          isActive: true,
        })
      }
    }
  }, [buyer, isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData, isEditMode)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-dark-lighter rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-lighter border-b border-gray-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">
            {isEditMode ? 'Edit Buyer' : 'Add New Buyer'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark border border-gray-700 text-gray-300 hover:text-primary hover:border-primary transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Buyer Type *
              </label>
              <select
                name="buyerType"
                value={formData.buyerType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Select type</option>
                {buyerTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Budget Range *
              </label>
              <select
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Select budget range</option>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Land Size
              </label>
              <select
                name="landSize"
                value={formData.landSize}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Select land size</option>
                {landSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Bedrooms
              </label>
              <input
                type="text"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g., 3 or 3+"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Bathrooms
              </label>
              <input
                type="text"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g., 2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Garage
              </label>
              <input
                type="text"
                name="garage"
                value={formData.garage}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g., 2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Preferred Suburbs *
            </label>
            <input
              type="text"
              name="preferredSuburbs"
              value={formData.preferredSuburbs}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g., Beverly Hills, Santa Monica, Venice"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Additional Preferences
            </label>
            <textarea
              name="additionalPreferences"
              value={formData.additionalPreferences}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="e.g., Modern kitchen, outdoor living area"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="preApproved"
                checked={formData.preApproved}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-700 bg-dark text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-300">Pre-Approved</span>
            </label>
            {isEditMode && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-700 bg-dark text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-300">Active</span>
              </label>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-dark border-2 border-gray-700 text-gray-300 font-semibold rounded-lg hover:border-primary hover:text-primary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BuyerModal



