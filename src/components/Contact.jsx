'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Send, User, MessageSquare } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const Contact = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.1 })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredAgent: '',
    message: '',
  })
  const [contactInfo, setContactInfo] = useState(null)
  const [agents, setAgents] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    fetchContactInfo()
    fetchAgents()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/contact-info`)
      if (response.ok) {
        const data = await response.json()
        setContactInfo(data)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
    }
  }

  const fetchAgents = async () => {
    try {
      const response = await fetch(`${API_URL}/agents`)
      if (response.ok) {
        const data = await response.json()
        setAgents(data.filter((agent) => agent.isActive))
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        agentId: formData.preferredAgent || undefined,
        message: formData.message,
      }

      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        alert('Thank you for your message! We will get back to you soon.')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          preferredAgent: '',
          message: '',
        })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" ref={sectionRef} className={`py-24 px-4 sm:px-6 lg:px-8 bg-dark section-animate section-fade-up ${sectionVisible ? 'animate-in' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            Get in Touch
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Ready to find your dream property? Contact us today and let's make it happen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Panel - Contact Form */}
          <div className="bg-dark-light rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-6 text-white">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Preferred Agent
                </label>
                <select
                  name="preferredAgent"
                  value={formData.preferredAgent}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select an agent (optional)</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell us about your property needs..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Contact Information Card */}
            <div className="bg-dark-light rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Phone</h4>
                    <p className="text-gray-300">{contactInfo?.phone || '+1 (555) 123-4567'}</p>
                    {contactInfo?.phoneHours && (
                      <p className="text-gray-400 text-sm mt-1">{contactInfo.phoneHours}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Email</h4>
                    <p className="text-gray-300">{contactInfo?.email || 'info@eliteproperties.com'}</p>
                    {contactInfo?.emailSupport && (
                      <p className="text-gray-400 text-sm mt-1">{contactInfo.emailSupport}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Office</h4>
                    <p className="text-gray-300 whitespace-pre-line">
                      {contactInfo?.office || '9200 Sunset Blvd, Suite 500\nLos Angeles, CA 90069'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Agents Card */}
            {agents.length > 0 && (
              <div className="bg-dark-light rounded-2xl p-8 border border-primary/20">
                <h3 className="text-2xl font-bold mb-6 text-white">Our Agents</h3>
                <div className="space-y-6">
                  {agents.map((agent) => (
                    <div key={agent.id} className="bg-dark rounded-xl p-4 border border-primary/20">
                      <h4 className="font-bold text-lg mb-1 text-white">{agent.name}</h4>
                      {agent.role && (
                        <p className="text-primary text-sm mb-2">{agent.role}</p>
                      )}
                      {agent.email && (
                        <p className="text-gray-400 text-sm">{agent.email}</p>
                      )}
                      {agent.phone && (
                        <p className="text-gray-400 text-sm">{agent.phone}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
