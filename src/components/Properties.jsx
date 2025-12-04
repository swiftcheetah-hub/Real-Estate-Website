'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bed, Bath, Square, MapPin, ArrowRight, Building2, Star, Filter } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const Properties = () => {
  const [filter, setFilter] = useState('all')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.1 })

  useEffect(() => {
    fetchProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/properties/public')
      if (response.ok) {
        const data = await response.json()
        // Map backend data to frontend format
        const mappedProperties = data.map((property) => ({
          id: property.id,
          title: property.title,
          location: property.address ? property.address.split(',')[1]?.trim() || property.address.split(',')[0]?.trim() : 'Location TBD',
          address: property.address,
          price: parseFloat(property.price),
          beds: property.bedrooms || 0,
          baths: property.bathrooms || 0,
          sqft: property.area || 0,
          image: property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
          type: property.type || 'houses',
          featured: property.isFeatured || false,
          agent: property.agentId ? 'Agent' : 'Elite Properties',
        }))
        setProperties(mappedProperties)
      } else {
        console.error('Failed to fetch properties:', response.statusText)
        // Fallback to empty array or default properties
        setProperties([])
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      // Fallback to empty array
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProperties = filter === 'all' 
    ? properties 
    : properties.filter(p => p.type === filter)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filterOptions = [
    { id: 'all', label: 'All Properties' },
    { id: 'houses', label: 'Houses' },
    { id: 'apartments', label: 'Apartments' },
    { id: 'villas', label: 'Villas' },
  ]

  return (
    <section id="properties" ref={sectionRef} className={`py-24 px-4 sm:px-6 lg:px-8 bg-dark section-animate section-fade-up ${sectionVisible ? 'animate-in' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            Featured Properties
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            Discover our handpicked selection of luxury properties in prime locations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filterOptions.map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                filter === filterOption.id
                  ? 'bg-primary text-black border-2 border-primary'
                  : 'bg-transparent border-2 border-primary/30 text-primary hover:border-primary/50'
              }`}
            >
              <Filter className={`w-4 h-4 ${filter === filterOption.id ? 'text-black' : 'text-primary'}`} />
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Loading properties...</div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No properties available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, idx) => (
            <div
              key={property.id}
              className={`bg-dark-lighter rounded-2xl overflow-hidden border border-gray-700 hover:border-primary/50 transition-all duration-300 group cursor-pointer section-animate section-scale ${sectionVisible ? 'animate-in' : ''}`}
              style={{ transitionDelay: `${idx * 0.1}s` }}
              onClick={() => router.push(`/property/${property.id}`)}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Featured Tag */}
                {property.featured && (
                  <div className="absolute top-4 left-4 bg-primary rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                    <Star className="w-4 h-4 text-black fill-black" />
                    <span className="text-black text-sm font-semibold">Featured</span>
                  </div>
                )}
                
                {/* Price Overlay */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <div className="text-primary font-bold text-lg">{formatPrice(property.price)}</div>
                </div>
              </div>

              {/* Content - White Background Section */}
              <div className="bg-white p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">{property.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {property.location}
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.beds}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.baths}</span>
                  </div>
                  {property.sqft > 0 && (
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>{property.sqft.toLocaleString()} sqft</span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  Listed by <span className="font-semibold text-gray-700">{property.agent}</span>
                </div>

                {/* View Details Button */}
                <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2">
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Properties
