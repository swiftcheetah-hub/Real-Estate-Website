'use client'

import React, { useState, useEffect } from 'react'
import { Mail, Phone, User, Calendar, Trash2, CheckCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function MessageHistory() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch(`${API_URL}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/messages/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const handleDelete = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchMessages()
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const unreadCount = messages.filter((m) => !m.isRead).length

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Message History</h1>
          <p className="text-gray-400 text-sm">View and manage all contact messages.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading messages...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Message History</h1>
          <p className="text-gray-400 text-sm">View and manage all contact messages.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-all flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-dark-lighter rounded-xl border border-primary/20 overflow-hidden">
          <div className="p-4 border-b border-primary/20">
            <h2 className="text-lg font-bold text-white">Messages ({messages.length})</h2>
          </div>
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No messages yet</div>
            ) : (
              <div className="divide-y divide-primary/20">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message)
                      if (!message.isRead) {
                        handleMarkAsRead(message.id)
                      }
                    }}
                    className={`p-4 cursor-pointer hover:bg-dark transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-dark border-l-4 border-primary' : ''
                    } ${!message.isRead ? 'bg-dark/50' : ''}`}
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
                        <p className="text-xs text-gray-400">{message.email}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{message.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2 bg-dark-lighter rounded-xl border border-primary/20 p-6">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedMessage.firstName} {selectedMessage.lastName}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedMessage.email}
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {selectedMessage.phone}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 rounded-lg hover:bg-dark transition-colors text-red-400 hover:text-red-300"
                  title="Delete message"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                {formatDate(selectedMessage.createdAt)}
              </div>

              {selectedMessage.agentName && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-gray-400">Preferred Agent:</span>
                  <span className="text-primary font-semibold">{selectedMessage.agentName}</span>
                </div>
              )}

              <div className="pt-4 border-t border-primary/20">
                <h3 className="text-lg font-semibold text-white mb-3">Message</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {!selectedMessage.isRead && (
                <button
                  onClick={() => handleMarkAsRead(selectedMessage.id)}
                  className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Read
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a message to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

