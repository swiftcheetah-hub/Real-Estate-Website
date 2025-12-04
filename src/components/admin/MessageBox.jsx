'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'

const MessageBox = () => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchRecentMessages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // Fetch messages, bookings, guide downloads, and buyer enquiries unread counts
      const [messagesRes, bookingsRes, guideDownloadsRes, buyerEnquiriesRes] = await Promise.all([
        fetch('/api/messages/unread-count', {
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => ({ ok: false })),
        fetch('/api/bookings/unread-count', {
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => ({ ok: false })),
        fetch('/api/free-guide/downloads/unread-count', {
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => ({ ok: false })),
        fetch('/api/buyers/enquiries/unread-count', {
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => ({ ok: false })),
      ])

      let totalUnread = 0
      if (messagesRes.ok) {
        const messagesCount = await messagesRes.json()
        totalUnread += messagesCount
      }
      if (bookingsRes.ok) {
        const bookingsCount = await bookingsRes.json()
        totalUnread += bookingsCount
      }
      if (guideDownloadsRes.ok) {
        const guideDownloadsCount = await guideDownloadsRes.json()
        totalUnread += guideDownloadsCount
      }
      if (buyerEnquiriesRes.ok) {
        const buyerEnquiriesCount = await buyerEnquiriesRes.json()
        totalUnread += buyerEnquiriesCount
      }

      setUnreadCount(totalUnread)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const fetchRecentMessages = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) return

      // Fetch messages, bookings, guide downloads, and buyer enquiries
      const [messagesRes, bookingsRes, guideDownloadsRes, buyerEnquiriesRes] = await Promise.all([
        fetch('/api/messages', {
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => ({ ok: false })),
        fetch('/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => ({ ok: false })),
        fetch('/api/free-guide/downloads', {
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => ({ ok: false })),
        fetch('/api/buyers/enquiries/all', {
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => ({ ok: false })),
      ])

      const allItems = []

      if (messagesRes.ok) {
        const messages = await messagesRes.json()
        messages.forEach((msg) => {
          allItems.push({
            id: msg.id,
            type: 'message',
            firstName: msg.firstName,
            lastName: msg.lastName,
            email: msg.email,
            message: msg.message,
            isRead: msg.isRead,
            createdAt: msg.createdAt,
          })
        })
      }

      if (bookingsRes.ok) {
        const bookings = await bookingsRes.json()
        bookings.forEach((booking) => {
          const date = new Date(booking.appointmentDate).toLocaleDateString()
          const time = booking.appointmentTime
          const agentName = booking.agentPreference === 'both' 
            ? 'Best Available Agent' 
            : booking.agentPreference === 'sarah' 
            ? 'Sarah Mitchell' 
            : booking.agentPreference === 'michael'
            ? 'Michael Chen'
            : 'Selected Agent'
          
          allItems.push({
            id: booking.id,
            type: 'booking',
            firstName: booking.firstName,
            lastName: booking.lastName,
            email: booking.email,
            message: `New Property Appraisal Booking: ${date} at ${time} with ${agentName}. Property: ${booking.propertyAddress || 'Not specified'}`,
            isRead: booking.isRead,
            createdAt: booking.createdAt,
            bookingData: booking,
          })
        })
      }

      if (guideDownloadsRes.ok) {
        const downloads = await guideDownloadsRes.json()
        downloads.forEach((download) => {
          const guideTitle = download.guide?.title || 'Free Guide'
          allItems.push({
            id: download.id,
            type: 'guide-download',
            firstName: download.fullName.split(' ')[0] || '',
            lastName: download.fullName.split(' ').slice(1).join(' ') || '',
            email: download.email,
            message: `New Free Guide Download: ${download.fullName} downloaded "${guideTitle}"`,
            isRead: download.isRead,
            createdAt: download.createdAt,
            downloadData: download,
          })
        })
      }

      if (buyerEnquiriesRes.ok) {
        const enquiries = await buyerEnquiriesRes.json()
        enquiries.forEach((enquiry) => {
          const buyerInitials = enquiry.buyer?.fullName
            ? enquiry.buyer.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
            : 'N/A'
          allItems.push({
            id: enquiry.id,
            type: 'buyer-enquiry',
            firstName: enquiry.agentName.split(' ')[0] || '',
            lastName: enquiry.agentName.split(' ').slice(1).join(' ') || '',
            email: enquiry.agentEmail,
            message: `New Buyer Enquiry: ${enquiry.agentName} from ${enquiry.agencyOffice} enquired about buyer ${buyerInitials} (${enquiry.preferredSplit} split)`,
            isRead: enquiry.isRead,
            createdAt: enquiry.createdAt,
            enquiryData: enquiry,
          })
        })
      }

      // Sort by date and get recent unread items
      const recentItems = allItems
        .filter((item) => !item.isRead)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
      
      setMessages(recentItems)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = () => {
    setIsOpen(false)
    router.push('/admin/messages')
  }

  const handleItemClick = (item) => {
    if (item.type === 'booking') {
      setIsOpen(false)
      router.push('/admin/bookings')
    } else if (item.type === 'guide-download') {
      setIsOpen(false)
      router.push('/admin/free-guide')
    } else if (item.type === 'buyer-enquiry') {
      setIsOpen(false)
      router.push('/admin/buyer-enquiries')
    } else {
      setIsOpen(false)
      router.push('/admin/messages')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-dark transition-colors"
        title="Messages"
      >
        <MessageSquare className="w-6 h-6 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-dark-lighter rounded-lg border border-primary/20 shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-white">Messages</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-dark transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No messages yet</div>
            ) : (
              <div className="divide-y divide-primary/20">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleItemClick(message)}
                    className={`p-4 hover:bg-dark transition-colors cursor-pointer ${
                      !message.isRead ? 'bg-dark/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">
                            {message.firstName} {message.lastName}
                          </span>
                          {!message.isRead && (
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{message.email}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2 mt-2">
                      {message.message}
                    </p>
                    {message.type === 'booking' && (
                      <p className="text-xs text-primary mt-1">📅 Property Appraisal Booking</p>
                    )}
                    {message.type === 'guide-download' && (
                      <p className="text-xs text-primary mt-1">📥 Free Guide Download</p>
                    )}
                    {message.agentName && (
                      <p className="text-xs text-primary mt-1">Agent: {message.agentName}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-primary/20">
            <button
              onClick={handleViewDetails}
              className="w-full py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all"
            >
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageBox

