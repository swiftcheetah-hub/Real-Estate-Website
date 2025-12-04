'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../../src/components/Navbar'
import Footer from '../../../src/components/Footer'
import AgentContactModal from '../../../src/components/AgentContactModal'
import { Search, X, MapPin, DollarSign, Home, Car, Square } from 'lucide-react'

// Helper function to get initials from full name
const getInitials = (fullName) => {
  if (!fullName) return 'N/A'
  const parts = fullName.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return fullName.substring(0, 2).toUpperCase()
}

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

export default function MatchBuyerDatabasePage() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [buyers, setBuyers] = useState([])
  const [filteredBuyers, setFilteredBuyers] = useState([])
  const [selectedBuyer, setSelectedBuyer] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetchBuyers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBuyers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/buyers')
      if (response.ok) {
        const data = await response.json()
        setBuyers(data)
        setFilteredBuyers(data)
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch buyers' }))
        setError(errorData.message || 'Failed to fetch buyers. Please try again later.')
        setBuyers([])
        setFilteredBuyers([])
      }
    } catch (error) {
      console.error('Error fetching buyers:', error)
      setError('Unable to connect to the server. Please check your connection and try again.')
      setBuyers([])
      setFilteredBuyers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Filter buyers based on search query
    if (searchQuery.trim() === '') {
      setFilteredBuyers(buyers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = buyers.filter(buyer => {
        const initials = getInitials(buyer.fullName)
        return (
          initials.toLowerCase().includes(query) ||
          buyer.fullName.toLowerCase().includes(query) ||
          buyer.buyerType.toLowerCase().includes(query) ||
          buyer.preferredSuburbs.toLowerCase().includes(query) ||
          buyer.budgetRange.toLowerCase().includes(query) ||
          (buyer.additionalPreferences && buyer.additionalPreferences.toLowerCase().includes(query))
        )
      })
      setFilteredBuyers(filtered)
    }
  }, [searchQuery, buyers])

  const handleEnquire = (buyer) => {
    setSelectedBuyer(buyer)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBuyer(null)
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar scrollY={scrollY} />
      <div className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg bg-dark-lighter border border-gray-700 text-gray-300 hover:text-primary hover:border-primary transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Buyers Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Active Buyers ({filteredBuyers.length})
            </h2>
            <button
              onClick={() => router.push('/match-buyer')}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-dark-lighter border border-gray-700 text-gray-300 hover:text-primary hover:border-primary transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Browse buyers looking for properties"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-dark-lighter border-2 border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Buyer Cards Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Loading buyers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg mb-2">Error loading buyers</p>
              <p className="text-gray-400 text-sm">{error}</p>
              <button
                onClick={fetchBuyers}
                className="mt-4 px-6 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all"
              >
                Retry
              </button>
            </div>
          ) : filteredBuyers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuyers.map((buyer) => {
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
                  key={buyer.id}
                  className="bg-dark-lighter rounded-xl p-6 border border-gray-700 hover:border-primary/50 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-lg">{initials}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{initials}</h3>
                      <p className="text-gray-400 text-sm">Added {formatDate(buyer.createdAt)}</p>
                    </div>
                  </div>

                  {/* Buyer Type & Pre-Approval */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${buyerTypeColor}`}>
                      {buyer.buyerType}
                    </span>
                    {buyer.preApproved && (
                      <span className="px-3 py-1 rounded-full bg-green-600 text-white text-sm font-medium">
                        Pre-Approved: Yes
                      </span>
                    )}
                  </div>

                  {/* Budget Range */}
                  <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span className="text-white text-sm font-medium">Budget Range</span>
                    </div>
                    <p className="text-green-400 font-bold text-xl">{buyer.budgetRange}</p>
                  </div>

                  {/* Property Specifications */}
                  <div className="space-y-2 mb-4">
                    {buyer.bedrooms && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Home className="w-4 h-4 text-primary" />
                        <span className="text-sm">Bedrooms: {buyer.bedrooms}</span>
                      </div>
                    )}
                    {buyer.bathrooms && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Home className="w-4 h-4 text-primary" />
                        <span className="text-sm">Bathrooms: {buyer.bathrooms}</span>
                      </div>
                    )}
                    {buyer.garage && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Car className="w-4 h-4 text-primary" />
                        <span className="text-sm">Garage: {buyer.garage}</span>
                      </div>
                    )}
                    {buyer.landSize && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Square className="w-4 h-4 text-primary" />
                        <span className="text-sm">Land Size: {buyer.landSize}</span>
                      </div>
                    )}
                  </div>

                  {/* Preferred Suburbs */}
                  <div className="mb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary mt-1" />
                      <span className="text-white text-sm font-medium">Preferred Suburbs</span>
                    </div>
                    <p className="text-gray-300 text-sm ml-6">{buyer.preferredSuburbs}</p>
                  </div>

                  {/* Additional Preferences */}
                  {buyer.additionalPreferences && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-1">Additional Preferences</p>
                      <p className="text-white text-sm">{buyer.additionalPreferences}</p>
                    </div>
                  )}

                  {/* Enquire Button */}
                  <button
                    onClick={() => handleEnquire(buyer)}
                    className="w-full py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-black transition-all"
                  >
                    Enquire
                  </button>
                </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No buyers found matching your search.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      {selectedBuyer && (
        <AgentContactModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          buyerInitials={getInitials(selectedBuyer.fullName)}
          buyerId={selectedBuyer.id}
        />
      )}
    </div>
  )
}

