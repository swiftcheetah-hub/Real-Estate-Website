'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Bed,
  Bath,
  Square,
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Eye,
  TrendingUp,
  Users,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Calendar,
  Phone,
  Mail,
  Layers,
  Map,
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const PropertyDetails = () => {
  const params = useParams()
  const id = params.id
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [property, setProperty] = useState(null)
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [views, setViews] = useState(2847)
  const [saves, setSaves] = useState(342)
  const [shares, setShares] = useState(156)
  const [inquiries, setInquiries] = useState(89)

  useEffect(() => {
    if (id) {
      fetchProperty()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    // Simulate view increment
    const interval = setInterval(() => {
      setViews((prev) => prev + Math.floor(Math.random() * 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/properties/public/${id}`)
      if (response.ok) {
        const data = await response.json()
        
        // Map backend data to frontend format
        const mappedProperty = {
          id: data.id,
          title: data.title,
          address: data.address || 'Address TBD',
          location: data.address ? data.address.split(',')[1]?.trim() || data.address.split(',')[0]?.trim() : 'Location TBD',
          price: parseFloat(data.price),
          beds: data.bedrooms || 0,
          baths: data.bathrooms || 0,
          sqft: data.area || 0,
          yearBuilt: data.yearBuilt || null,
          floor: data.floor || null,
          landSize: data.landSize || 'N/A',
          lotSize: data.landSize || 'N/A',
          images: data.images && data.images.length > 0 
            ? data.images 
            : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'],
          description: data.description || 'No description available.',
          amenities: data.features && data.features.length > 0 
            ? data.features 
            : [],
        }
        setProperty(mappedProperty)

        // Fetch agent if agentId exists
        if (data.agentId) {
          fetchAgent(data.agentId)
        } else {
          // Default agent
          setAgent({
            name: 'Elite Properties',
            phone: '+1 (555) 123-4567',
            email: 'info@eliteproperties.com',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
          })
        }
      } else {
        console.error('Failed to fetch property:', response.statusText)
        // Redirect to properties page if not found
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      // Redirect to properties page on error
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchAgent = async (agentId) => {
    try {
      const response = await fetch('/api/agents/public')
      if (response.ok) {
        const agents = await response.json()
        const foundAgent = agents.find(a => a.id === agentId)
        if (foundAgent) {
          setAgent({
            name: foundAgent.name,
            phone: foundAgent.phone || '+1 (555) 123-4567',
            email: foundAgent.email || 'info@eliteproperties.com',
            image: foundAgent.imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
          })
        } else {
          // Default agent if not found
          setAgent({
            name: 'Elite Properties',
            phone: '+1 (555) 123-4567',
            email: 'info@eliteproperties.com',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching agent:', error)
      // Default agent on error
      setAgent({
        name: 'Elite Properties',
        phone: '+1 (555) 123-4567',
        email: 'info@eliteproperties.com',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
      })
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const nextImage = () => {
    if (property && property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property && property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  const weeklyViewsData = [
    { day: 'Mon', views: 420 },
    { day: 'Tue', views: 580 },
    { day: 'Wed', views: 650 },
    { day: 'Thu', views: 720 },
    { day: 'Fri', views: 890 },
    { day: 'Sat', views: 950 },
    { day: 'Sun', views: 820 },
  ]

  const priceTrendData = [
    { month: 'Jan', value: 2350000 },
    { month: 'Feb', value: 2380000 },
    { month: 'Mar', value: 2400000 },
    { month: 'Apr', value: 2430000 },
    { month: 'May', value: 2470000 },
    { month: 'Jun', value: 2500000 },
  ]

  const socialShares = [
    { platform: 'Facebook', count: 68, percentage: 68 },
    { platform: 'Instagram', count: 45, percentage: 45 },
    { platform: 'Twitter', count: 28, percentage: 28 },
    { platform: 'LinkedIn', count: 15, percentage: 15 },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-dark pt-20 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading property details...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-dark pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Property not found</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all"
          >
            Back to Properties
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Properties
        </button>

        {/* Social Reach Header */}
        <div className="glass rounded-xl p-6 border border-primary/10 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Eye className="w-5 h-5" />
                <span className="text-2xl font-bold">{views.toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-400">Total Views</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Heart className="w-5 h-5" />
                <span className="text-2xl font-bold">{saves}</span>
              </div>
              <div className="text-sm text-gray-400">Saves</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Share2 className="w-5 h-5" />
                <span className="text-2xl font-bold">{shares}</span>
              </div>
              <div className="text-sm text-gray-400">Shares</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <MessageCircle className="w-5 h-5" />
                <span className="text-2xl font-bold">{inquiries}</span>
              </div>
              <div className="text-sm text-gray-400">Inquiries</div>
            </div>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="relative h-96 md:h-[600px] rounded-2xl overflow-hidden mb-8 border border-primary/10">
          <img
            src={property.images[currentImageIndex]}
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-primary w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-400 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                {property.address}
              </div>
              <div className="text-4xl font-bold text-primary mb-6">
                {formatPrice(property.price)}
              </div>
            </div>

            {/* Property Details */}
            <div className="glass rounded-xl p-6 border border-primary/10">
              <h2 className="text-2xl font-bold mb-6">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Bed className="w-5 h-5" />
                    <span className="text-sm">Bedrooms</span>
                  </div>
                  <div className="text-2xl font-bold">{property.beds}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Bath className="w-5 h-5" />
                    <span className="text-sm">Bathrooms</span>
                  </div>
                  <div className="text-2xl font-bold">{property.baths}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Square className="w-5 h-5" />
                    <span className="text-sm">Square Feet</span>
                  </div>
                  <div className="text-2xl font-bold">{property.sqft ? property.sqft.toLocaleString() : 'N/A'}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Layers className="w-5 h-5" />
                    <span className="text-sm">Floors</span>
                  </div>
                  <div className="text-2xl font-bold">{property.floor || 'N/A'}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Map className="w-5 h-5" />
                    <span className="text-sm">Land Size</span>
                  </div>
                  <div className="text-lg font-bold">{property.landSize}</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-2 text-sm">Year Built</div>
                  <div className="text-2xl font-bold">{property.yearBuilt || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass rounded-xl p-6 border border-primary/10">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="glass rounded-xl p-6 border border-primary/10">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-gray-300">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Reach & Insights */}
            <div className="glass rounded-xl p-6 border border-primary/10">
              <h2 className="text-2xl font-bold mb-6">Social Reach & Engagement</h2>

              {/* Platform Distribution */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Platform Distribution</h3>
                <div className="space-y-4">
                  {socialShares.map((share, idx) => {
                    const Icon =
                      share.platform === 'Facebook'
                        ? Facebook
                        : share.platform === 'Instagram'
                        ? Instagram
                        : share.platform === 'Twitter'
                        ? Twitter
                        : Linkedin
                    return (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <span className="text-gray-300">{share.platform}</span>
                          </div>
                          <span className="text-primary font-semibold">{share.count}</span>
                        </div>
                        <div className="w-full bg-dark-lighter rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${share.percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Weekly Views Trend */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Weekly Views Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={weeklyViewsData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="day" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #fbbf24',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#fbbf24"
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Property Insights */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Property Insights</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Property Value', value: '+12%', trend: 'up' },
                    { label: 'Market Interest', value: 'High', trend: 'up' },
                    { label: 'Price Trend', value: '+6.5%', trend: 'up' },
                    { label: 'Time on Market', value: '12 days', trend: 'neutral' },
                  ].map((insight, idx) => (
                    <div
                      key={idx}
                      className="glass rounded-lg p-4 border border-primary/10"
                    >
                      <div className="text-sm text-gray-400 mb-1">{insight.label}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">{insight.value}</span>
                        {insight.trend === 'up' && (
                          <TrendingUp className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Trend Chart */}
                <div>
                  <h4 className="text-md font-semibold mb-4">6-Month Price Trend</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={priceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #fbbf24',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => formatPrice(value)}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#fbbf24"
                        strokeWidth={2}
                        dot={{ fill: '#fbbf24', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Agent Contact */}
            {agent && (
              <div className="glass rounded-xl p-6 border border-primary/10 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                  />
                  <div>
                    <div className="font-bold text-lg">{agent.name}</div>
                    <div className="text-sm text-gray-400">Real Estate Agent</div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center gap-3 p-3 bg-dark-lighter rounded-lg hover:bg-primary/10 transition-all"
                    >
                      <Phone className="w-5 h-5 text-primary" />
                      <span className="text-gray-300">{agent.phone}</span>
                    </a>
                  )}
                  {agent.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-3 p-3 bg-dark-lighter rounded-lg hover:bg-primary/10 transition-all"
                    >
                      <Mail className="w-5 h-5 text-primary" />
                      <span className="text-gray-300">{agent.email}</span>
                    </a>
                  )}
                </div>
              <button className="w-full py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all mb-3">
                Schedule a Tour
              </button>
              <button className="w-full py-3 glass border border-primary/30 text-primary font-semibold rounded-lg hover:border-primary hover:bg-primary/10 transition-all">
                Virtual Tour
              </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="glass rounded-xl p-6 border border-primary/10">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 py-3 glass border border-primary/20 text-primary font-semibold rounded-lg hover:border-primary hover:bg-primary/10 transition-all">
                  <Heart className="w-5 h-5" />
                  Save Property
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 glass border border-primary/20 text-primary font-semibold rounded-lg hover:border-primary hover:bg-primary/10 transition-all">
                  <Share2 className="w-5 h-5" />
                  Share Property
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 glass border border-primary/20 text-primary font-semibold rounded-lg hover:border-primary hover:bg-primary/10 transition-all">
                  <Calendar className="w-5 h-5" />
                  Schedule Viewing
                </button>
              </div>
            </div>

            {/* High Interest Alert */}
            <div className="glass rounded-xl p-6 border border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2 text-primary mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold">High Interest Property</span>
              </div>
              <p className="text-sm text-gray-300">
                This property has received {inquiries} inquiries in the last week. Act fast!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails

