'use client'

import React, { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'

const splitPercentages = ['10%', '20%', '30%', '40%', '50%']

const AgentContactModal = ({ isOpen, onClose, buyerInitials, buyerId }) => {
  const [formData, setFormData] = useState({
    agentName: '',
    agentPhone: '',
    agentEmail: '',
    agencyOffice: '',
    preferredSplit: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/buyers/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          buyerId,
        }),
      })

      if (response.ok) {
        alert('Your enquiry has been submitted successfully!')
        setFormData({
          agentName: '',
          agentPhone: '',
          agentEmail: '',
          agencyOffice: '',
          preferredSplit: '',
        })
        onClose()
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to submit enquiry' }))
        alert(`Error: ${error.message || 'Failed to submit enquiry. Please try again.'}`)
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error)
      alert('Error submitting enquiry. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-lighter rounded-2xl p-8 border border-gray-700 w-full max-w-md mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-dark border border-gray-700 text-gray-300 hover:text-primary hover:border-primary transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Agent Contact Form</h2>
          <p className="text-gray-400 text-sm">
            Connect with buyer: <span className="text-primary font-semibold">{buyerInitials}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Name *
            </label>
            <input
              type="text"
              name="agentName"
              value={formData.agentName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Phone *
            </label>
            <input
              type="tel"
              name="agentPhone"
              value={formData.agentPhone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Email *
            </label>
            <input
              type="email"
              name="agentEmail"
              value={formData.agentEmail}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Your email address"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Agency Office *
            </label>
            <input
              type="text"
              name="agencyOffice"
              value={formData.agencyOffice}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Your agency name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Preferred Split *
            </label>
            <div className="relative">
              <select
                name="preferredSplit"
                value={formData.preferredSplit}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors appearance-none pr-10"
              >
                <option value="">Select split percentage</option>
                {splitPercentages.map((percentage) => (
                  <option key={percentage} value={percentage}>
                    {percentage}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-dark border-2 border-gray-700 text-gray-300 font-semibold rounded-lg hover:border-primary hover:text-primary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AgentContactModal

