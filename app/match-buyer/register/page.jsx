'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../../src/components/Navbar'
import Footer from '../../../src/components/Footer'
import { X, ChevronDown } from 'lucide-react'

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

export default function BuyerRegistrationPage() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
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
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      const response = await fetch('/api/buyers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Registration successful! Your buyer profile has been created.')
        router.push('/match-buyer')
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to register' }))
        alert(`Error: ${error.message || 'Failed to register. Please try again.'}`)
      }
    } catch (error) {
      console.error('Error submitting registration:', error)
      alert('Error submitting registration. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar scrollY={scrollY} />
      <div className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
                Match <span className="text-primary">Buyer</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Connect with potential buyers looking for properties that match your listing. Browse our current buyer database or register as a buyer.
              </p>
            </div>
            <button
              onClick={() => router.push('/match-buyer')}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-dark-lighter border border-gray-700 text-gray-300 hover:text-primary hover:border-primary transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Registration Form */}
          <div className="bg-dark-lighter rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Buyer Registration Form</h2>
              <button
                onClick={() => router.push('/match-buyer')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact Information (Private)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="John Doe"
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
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="john@example.com"
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
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  * Your contact details will remain private. Only your initials will be displayed publicly.
                </p>
              </div>

              {/* Type of Buyer */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Type of Buyer *
                </label>
                <div className="relative">
                  <select
                    name="buyerType"
                    value={formData.buyerType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors appearance-none pr-10"
                  >
                    <option value="">Select type</option>
                    {buyerTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Budget Range *
                </label>
                <div className="relative">
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors appearance-none pr-10"
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Property Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Property Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">
                      Bedrooms
                    </label>
                    <input
                      type="text"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g., 2"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Suburbs */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Preferred Suburbs *
                </label>
                <input
                  type="text"
                  name="preferredSuburbs"
                  value={formData.preferredSuburbs}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g., Beverly Hills, Santa Monica, Venice"
                />
              </div>

              {/* Land Size */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Land Size
                </label>
                <div className="relative">
                  <select
                    name="landSize"
                    value={formData.landSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors appearance-none pr-10"
                  >
                    <option value="">Select land size</option>
                    {landSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Additional Preferences */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Additional Preferences
                </label>
                <textarea
                  name="additionalPreferences"
                  value={formData.additionalPreferences}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="e.g., Modern kitchen, outdoor living area, pool, water views"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/match-buyer')}
                  className="px-6 py-3 bg-dark border-2 border-gray-700 text-gray-300 font-semibold rounded-lg hover:border-primary hover:text-primary transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

