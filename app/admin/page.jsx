'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Building2, Users, Home, Star, Image, BookOpen, Mail, Calendar, TrendingUp, Quote, Phone, Plus } from 'lucide-react'

export default function AdminDashboard() {
      const [stats, setStats] = useState([
    { label: 'Total Properties', value: '0', icon: Home, color: 'text-blue-400', loading: true },
    { label: 'Total Agents', value: '0', icon: Users, color: 'text-green-400', loading: true },
    { label: 'Total Reviews', value: '0', icon: Star, color: 'text-yellow-400', loading: true },
    { label: 'Gallery Images', value: '0', icon: Image, color: 'text-purple-400', loading: true },
    { label: 'Investors', value: '0', icon: TrendingUp, color: 'text-pink-400', loading: true },
    { label: 'Contact Messages', value: '0', icon: Mail, color: 'text-red-400', loading: true },
    { label: 'Journey Milestones', value: '0', icon: Calendar, color: 'text-orange-400', loading: true },
    { label: 'Match Buyers', value: '0', icon: Users, color: 'text-cyan-400', loading: true },
  ])
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
      }

      // Fetch all data in parallel
      const [propertiesRes, agentsRes, reviewsRes, galleryRes, investorsRes, messagesRes, journeysRes, buyersRes] = await Promise.all([
        fetch('/api/properties', { headers }).catch(() => ({ ok: false })),
        fetch('/api/agents', { headers }).catch(() => ({ ok: false })),
        fetch('/api/reviews', { headers }).catch(() => ({ ok: false })),
        fetch('/api/gallery', { headers }).catch(() => ({ ok: false })),
        fetch('/api/investors', { headers }).catch(() => ({ ok: false })),
        fetch('/api/messages', { headers }).catch(() => ({ ok: false })),
        fetch('/api/journeys', { headers }).catch(() => ({ ok: false })),
        fetch('/api/buyers/admin', { headers }).catch(() => ({ ok: false })),
      ])

      // Update stats
      const newStats = [...stats]
      
      if (propertiesRes.ok) {
        const data = await propertiesRes.json()
        newStats[0] = { ...newStats[0], value: data.length.toString(), loading: false }
      } else {
        newStats[0] = { ...newStats[0], loading: false }
      }

      if (agentsRes.ok) {
        const data = await agentsRes.json()
        newStats[1] = { ...newStats[1], value: data.length.toString(), loading: false }
      } else {
        newStats[1] = { ...newStats[1], loading: false }
      }

      if (reviewsRes.ok) {
        const data = await reviewsRes.json()
        newStats[2] = { ...newStats[2], value: data.length.toString(), loading: false }
      } else {
        newStats[2] = { ...newStats[2], loading: false }
      }

      if (galleryRes.ok) {
        const data = await galleryRes.json()
        newStats[3] = { ...newStats[3], value: data.length.toString(), loading: false }
      } else {
        newStats[3] = { ...newStats[3], loading: false }
      }

      if (investorsRes.ok) {
        const data = await investorsRes.json()
        newStats[4] = { ...newStats[4], value: data.length.toString(), loading: false }
      } else {
        newStats[4] = { ...newStats[4], loading: false }
      }

      if (messagesRes.ok) {
        const data = await messagesRes.json()
        newStats[5] = { ...newStats[5], value: data.length.toString(), loading: false }
        // Get recent messages (sorted by date, limit to 5)
        const sortedMessages = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
        setRecentMessages(sortedMessages)
      } else {
        newStats[5] = { ...newStats[5], loading: false }
      }

      if (journeysRes.ok) {
        const data = await journeysRes.json()
        newStats[6] = { ...newStats[6], value: data.length.toString(), loading: false }
      } else {
        newStats[6] = { ...newStats[6], loading: false }
      }

      if (buyersRes.ok) {
        const data = await buyersRes.json()
        newStats[7] = { ...newStats[7], value: data.length.toString(), loading: false }
      } else {
        newStats[7] = { ...newStats[7], loading: false }
      }

      setStats(newStats)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set all stats to not loading on error
      setStats(prev => prev.map(stat => ({ ...stat, loading: false })))
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { name: 'Add Property', href: '/admin/properties', icon: Plus, color: 'bg-primary text-black' },
    { name: 'Add Agent', href: '/admin/agents/register', icon: Users, color: 'bg-primary/20 text-primary border border-primary' },
    { name: 'Add Review', href: '/admin/reviews', icon: Quote, color: 'bg-primary/20 text-primary border border-primary' },
    { name: 'Manage Gallery', href: '/admin/gallery', icon: Image, color: 'bg-primary/20 text-primary border border-primary' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
        <p className="text-sm text-gray-400">Welcome back! Manage your real estate portfolio from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className="bg-dark-lighter rounded-xl p-4 border border-primary/20 hover:border-primary/40 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-dark ${stat.color} bg-opacity-10`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.loading ? (
                  <span className="inline-block w-8 h-6 bg-dark rounded animate-pulse"></span>
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-lighter rounded-xl p-4 border border-primary/20">
        <h2 className="text-lg font-bold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon
            return (
              <Link
                key={idx}
                href={action.href}
                className={`px-4 py-3 rounded-lg font-semibold text-sm text-center transition-all hover:scale-105 flex items-center justify-center gap-2 ${action.color}`}
              >
                <Icon className="w-4 h-4" />
                {action.name}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-dark-lighter rounded-xl p-4 border border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Recent Messages</h2>
          <Link
            href="/admin/messages"
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {loading ? (
            <div className="text-gray-400 text-center py-4 text-sm">Loading messages...</div>
          ) : recentMessages.length > 0 ? (
            recentMessages.map((message) => (
              <div
                key={message.id}
                className="bg-dark rounded-lg p-3 border border-primary/10 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm">
                        {message.firstName} {message.lastName}
                      </span>
                      {!message.isRead && (
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs line-clamp-2">{message.message}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-4 text-sm">
              No new messages
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

