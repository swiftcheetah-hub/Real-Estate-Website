'use client'

import React, { useState, useEffect } from 'react'
import { Download, TrendingUp, BarChart3, Home, FileText, CheckCircle, Mail, User, Bell } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const FreeGuide = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.1 })
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    fetchInvestors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchInvestors = async () => {
    try {
      const response = await fetch('/api/investors/public')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched investors:', data) // Debug log
        setTestimonials(data)
      } else {
        console.error('Failed to fetch investors:', response.status, response.statusText)
        // Fallback to default testimonials
        setTestimonials([
          {
            name: 'Jessica Martinez',
            role: 'Real Estate Investor',
            imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
            testimonial: 'This guide helped me identify profitable investment opportunities I would have missed otherwise.'
          },
          {
            name: 'David Park',
            role: 'First-Time Buyer',
            imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
            testimonial: 'Clear, actionable insights that gave me confidence in making my first luxury property purchase.'
          },
          {
            name: 'Amanda Roberts',
            role: 'Portfolio Manager',
            imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
            testimonial: 'The market analysis section alone is worth thousands. Essential reading for serious investors.'
          },
        ])
      }
    } catch (error) {
      console.error('Error fetching investors:', error)
      // Fallback to default testimonials
      setTestimonials([
        {
          name: 'Jessica Martinez',
          role: 'Real Estate Investor',
          imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
          testimonial: 'This guide helped me identify profitable investment opportunities I would have missed otherwise.'
        },
        {
          name: 'David Park',
          role: 'First-Time Buyer',
          imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
          testimonial: 'Clear, actionable insights that gave me confidence in making my first luxury property purchase.'
        },
        {
          name: 'Amanda Roberts',
          role: 'Portfolio Manager',
          imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
          testimonial: 'The market analysis section alone is worth thousands. Essential reading for serious investors.'
        },
      ])
    }
  }

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [activeGuide, setActiveGuide] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchActiveGuide()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchActiveGuide = async () => {
    try {
      const response = await fetch('/api/free-guide/active')
      if (response.ok) {
        const data = await response.json()
        setActiveGuide(data)
      }
    } catch (error) {
      console.error('Error fetching guide:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields.')
      return
    }

    setSubmitting(true)

    try {
      if (!activeGuide) {
        alert('Guide is not available at the moment. Please try again later.')
        setSubmitting(false)
        return
      }

      if (!activeGuide.fileUrl) {
        alert('Guide file is not available. Please contact support.')
        setSubmitting(false)
        return
      }

      // Create download record
      const downloadResponse = await fetch('/api/free-guide/downloads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guideId: activeGuide.id,
          fullName: formData.name,
          email: formData.email,
        }),
      })

      if (downloadResponse.ok) {
        // Construct file URL - check if it's already a full URL
        let fileUrl = activeGuide.fileUrl
        if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
          // If it starts with /uploads, use it as is, otherwise prepend /uploads
          if (!fileUrl.startsWith('/uploads/') && !fileUrl.startsWith('/')) {
            fileUrl = `/uploads/${fileUrl}`
          } else if (!fileUrl.startsWith('/')) {
            fileUrl = `/${fileUrl}`
          }
        }

        // Download the file
        try {
          // Fetch the file as a blob to ensure proper download
          const fileResponse = await fetch(fileUrl)
          if (!fileResponse.ok) {
            throw new Error('Failed to fetch file')
          }
          
          const blob = await fileResponse.blob()
          const blobUrl = window.URL.createObjectURL(blob)
          
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = activeGuide.fileName || 'guide.pdf'
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          
          // Clean up
          setTimeout(() => {
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)
          }, 100)

          alert('Thank you! Your guide download has started.')
          setFormData({ name: '', email: '' })
        } catch (downloadError) {
          console.error('Error downloading file:', downloadError)
          // Fallback: try direct link
          window.open(fileUrl, '_blank')
          alert('Thank you! Your guide download has started.')
          setFormData({ name: '', email: '' })
        }
      } else {
        const errorData = await downloadResponse.json().catch(() => ({ message: 'Failed to record download' }))
        throw new Error(errorData.message || 'Failed to record download')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(`Error submitting form: ${error.message || 'Please try again.'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const stats = [
    { value: '50+', label: 'Pages of Insights' },
    { value: activeGuide?.downloadCount ? `${activeGuide.downloadCount}+` : '15K+', label: 'Downloads' },
    { value: '$2.5M', label: 'Avg. Savings' },
  ]

  const features = [
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: '2024 luxury real estate trends and forecasts'
    },
    {
      icon: BarChart3,
      title: 'Investment Analysis',
      description: 'Expert tips on maximizing property ROI'
    },
    {
      icon: Home,
      title: 'Neighborhood Guides',
      description: 'Exclusive data on prime locations'
    },
    {
      icon: FileText,
      title: 'Buying Strategies',
      description: 'Proven tactics from industry experts'
    },
  ]

  return (
    <section id="free-guide" ref={sectionRef} className={`py-24 px-4 sm:px-6 lg:px-8 bg-dark section-animate section-fade-up ${sectionVisible ? 'animate-in' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Notification Badge */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <span className="text-primary text-sm font-semibold">Free Download Available</span>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                Get Your Free{' '}
                <span className="text-primary">Luxury Real Estate Investment Guide</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mt-6">
                Unlock insider secrets to profitable luxury real estate investments. This comprehensive 50+ page guide includes market analysis, investment strategies, and expert insights from our award-winning team.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Statistics */}
            <div className="flex flex-wrap gap-8 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-dark-light rounded-2xl p-8 border border-primary/20">
            {/* Badge */}
            <div className="flex justify-end mb-4">
              <span className="px-3 py-1 bg-primary text-black text-xs font-bold rounded-full">
                FREE
              </span>
            </div>

            {/* Guide Preview Graphic */}
            <div className="mb-8 flex justify-center">
              <div className="w-full max-w-xs h-64 bg-primary/10 rounded-xl border-2 border-primary/30 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center mb-4">
                  <div className="text-primary font-bold text-lg mb-1">2024 Edition</div>
                  <div className="text-gray-400 text-xs">Updated Monthly</div>
                </div>
                <div className="w-full space-y-2">
                  <div className="h-2 bg-primary/20 rounded"></div>
                  <div className="h-2 bg-primary/20 rounded w-3/4"></div>
                  <div className="h-2 bg-primary/20 rounded w-5/6"></div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Download Your Free Guide</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Join 15,000+ investors who&apos;ve downloaded this guide.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !activeGuide}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-black font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  {submitting ? 'Processing...' : 'Get My Free Guide Now'}
                </button>
              </form>

              <p className="text-gray-500 text-xs text-center">
                No spam, ever. Unsubscribe anytime. We respect your privacy.
              </p>

              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-gray-400 text-sm">Instant Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-gray-400 text-sm">No Credit Card</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Trusted by Thousands of Investors
            </h3>
            <p className="text-gray-400 text-lg">
              See what our community is saying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id || index}
                className="bg-dark-light rounded-xl p-6 border border-primary/20"
              >
                <div className="flex items-center gap-4 mb-4">
                  {testimonial.imageUrl ? (
                    <img
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center ${
                      testimonial.imageUrl ? 'hidden' : ''
                    }`}
                  >
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    {testimonial.role && (
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    )}
                  </div>
                </div>
                {testimonial.testimonial && (
                  <p className="text-gray-300 italic leading-relaxed">
                    &ldquo;{testimonial.testimonial}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FreeGuide

