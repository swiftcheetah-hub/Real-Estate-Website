'use client'

import React, { useState, useEffect } from 'react'
import { Save, Phone, Mail, MapPin, User } from 'lucide-react'

export default function ContactManagement() {
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    phoneHours: '',
    email: '',
    emailSupport: '',
    office: '',
  })
  const [agents, setAgents] = useState([])
  const [selectedAgents, setSelectedAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    fetchContactInfo()
    fetchAgents()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/contact-info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data) {
          setContactInfo({
            phone: data.phone || '',
            phoneHours: data.phoneHours || '',
            email: data.email || '',
            emailSupport: data.emailSupport || '',
            office: data.office || '',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/agents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAgents(data)
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAgentToggle = (agentId) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    )
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/contact-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(contactInfo),
      })

      if (response.ok) {
        alert('Contact information saved successfully!')
      } else {
        throw new Error('Failed to save contact information')
      }
    } catch (error) {
      console.error('Error saving contact info:', error)
      alert('Error saving contact information. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Contact Management</h1>
          <p className="text-gray-400 text-sm">Manage contact information and agents.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Contact Management</h1>
        <p className="text-gray-400 text-sm">Manage contact information and display agents on the contact page.</p>
      </div>

      {/* Contact Information */}
      <div className="bg-dark-lighter rounded-xl p-6 border border-primary/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-primary" />
          Contact Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={contactInfo.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Phone Hours
            </label>
            <input
              type="text"
              name="phoneHours"
              value={contactInfo.phoneHours}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="Mon-Fri 9am-6pm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={contactInfo.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="info@eliteproperties.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Email Support Text
            </label>
            <input
              type="text"
              name="emailSupport"
              value={contactInfo.emailSupport}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="24/7 Support"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Office Address
            </label>
            <textarea
              name="office"
              value={contactInfo.office}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="9200 Sunset Blvd, Suite 500&#10;Los Angeles, CA 90069"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Contact Information'}
          </button>
        </div>
      </div>

      {/* Our Agents Section */}
      <div className="bg-dark-lighter rounded-xl p-6 border border-primary/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Our Agents (Optional)
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Select agents to display on the contact page. Agents are automatically pulled from the Agent Registration page.
        </p>

        {agents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No agents registered yet.</p>
            <p className="text-sm mt-2">Register agents in the Agent Registration page first.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {agents.map((agent) => (
              <label
                key={agent.id}
                className="flex items-center gap-3 p-4 bg-dark rounded-lg border border-primary/20 hover:border-primary/40 cursor-pointer transition-all"
              >
                <input
                  type="checkbox"
                  checked={selectedAgents.includes(agent.id)}
                  onChange={() => handleAgentToggle(agent.id)}
                  className="w-5 h-5 rounded border-primary/20 bg-dark text-primary focus:ring-primary focus:ring-offset-dark"
                />
                <div className="flex-1">
                  <div className="font-semibold text-white">{agent.name}</div>
                  {agent.role && (
                    <div className="text-sm text-primary">{agent.role}</div>
                  )}
                  {agent.email && (
                    <div className="text-xs text-gray-400">{agent.email}</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

