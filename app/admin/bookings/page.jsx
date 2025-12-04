'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, Mail, Phone, MapPin, Home, CheckCircle, XCircle, AlertCircle, Trash2, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DeleteConfirmModal from '../../../src/components/admin/DeleteConfirmModal'

export default function BookingsManagement() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchBookings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/admin/login')
      } else {
        console.error('Error fetching bookings:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setIsDetailModalOpen(true)
    // Mark as read when viewing
    if (!booking.isRead) {
      markAsRead(booking.id)
    }
  }

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/bookings/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchBookings()
      }
    } catch (error) {
      console.error('Error marking booking as read:', error)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchBookings()
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      alert('Error updating booking status. Please try again.')
    }
  }

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch(`/api/bookings/${bookingToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchBookings()
        setDeleteModalOpen(false)
        setBookingToDelete(null)
        if (selectedBooking && selectedBooking.id === bookingToDelete.id) {
          setIsDetailModalOpen(false)
          setSelectedBooking(null)
        }
        alert('Booking deleted successfully!')
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/admin/login')
      } else {
        throw new Error('Failed to delete booking')
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert(`Error deleting booking: ${error.message || 'Please try again.'}`)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setBookingToDelete(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle
      case 'completed':
        return CheckCircle
      case 'cancelled':
        return XCircle
      default:
        return AlertCircle
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getAgentName = (preference) => {
    if (preference === 'both') return 'Best Available Agent'
    if (preference === 'sarah') return 'Sarah Mitchell'
    if (preference === 'michael') return 'Michael Chen'
    return 'Selected Agent'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Property Appraisal Bookings</h1>
          <p className="text-gray-400 text-sm">Manage property appraisal bookings.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading bookings...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Property Appraisal Bookings</h1>
        <p className="text-gray-400 text-sm">View and manage all property appraisal booking requests.</p>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="bg-dark-lighter rounded-xl p-10 border border-primary/20 text-center">
            <p className="text-gray-400 mb-3 text-sm">No bookings yet.</p>
            <p className="text-xs text-gray-500">Bookings will appear here when users submit appraisal requests.</p>
          </div>
        ) : (
          bookings.map((booking) => {
            const StatusIcon = getStatusIcon(booking.status)
            return (
              <div
                key={booking.id}
                className={`bg-dark-lighter rounded-xl p-6 border ${
                  !booking.isRead ? 'border-primary/40 bg-primary/5' : 'border-primary/20'
                } hover:border-primary/60 transition-all`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`px-3 py-1 rounded-lg border flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm font-semibold capitalize">{booking.status}</span>
                      </div>
                      {!booking.isRead && (
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-white">{booking.firstName} {booking.lastName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>{booking.email}</span>
                      </div>
                      {booking.phone && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="w-4 h-4 text-primary" />
                          <span>{booking.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{formatDate(booking.appointmentDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{booking.appointmentTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <User className="w-4 h-4 text-primary" />
                        <span>{getAgentName(booking.agentPreference)}</span>
                      </div>
                      {booking.propertyAddress && (
                        <div className="flex items-center gap-2 text-gray-300 md:col-span-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="truncate">{booking.propertyAddress}</span>
                        </div>
                      )}
                    </div>

                    {booking.propertyType && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-400">Property Type: </span>
                        <span className="text-sm text-gray-300">{booking.propertyType}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteClick(booking)}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedBooking && (
        <div
          className="fixed z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'fixed',
            margin: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'auto'
          }}
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="bg-dark-lighter rounded-xl border border-primary/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-dark-lighter border-b border-primary/20 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Booking Details</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-lg hover:bg-dark transition-colors text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Status</label>
                <div className="flex gap-2">
                  {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => {
                    const StatusIcon = getStatusIcon(status)
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedBooking.id, status)}
                        className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-all ${
                          selectedBooking.status === status
                            ? getStatusColor(status) + ' ring-2 ring-primary'
                            : 'bg-dark border-primary/20 text-gray-400 hover:border-primary/40'
                        }`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm font-semibold capitalize">{status}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">First Name</label>
                    <div className="px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white">
                      {selectedBooking.firstName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Last Name</label>
                    <div className="px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white">
                      {selectedBooking.lastName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Email</label>
                    <div className="px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white">
                      {selectedBooking.email}
                    </div>
                  </div>
                  {selectedBooking.phone && (
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Phone</label>
                      <div className="px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white">
                        {selectedBooking.phone}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Date</label>
                    <div className="px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white">
                      {formatDate(selectedBooking.appointmentDate)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Time</label>
                    <div className="px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white">
                      {selectedBooking.appointmentTime}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Agent Preference</label>
                    <div className="px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white">
                      {getAgentName(selectedBooking.agentPreference)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Property Details</h3>
                <div className="space-y-4">
                  {selectedBooking.propertyAddress && (
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Property Address</label>
                      <div className="px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white">
                        {selectedBooking.propertyAddress}
                      </div>
                    </div>
                  )}
                  {selectedBooking.propertyType && (
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Property Type</label>
                      <div className="px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white">
                        {selectedBooking.propertyType}
                      </div>
                    </div>
                  )}
                  {selectedBooking.notes && (
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Additional Notes</label>
                      <div className="px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white whitespace-pre-wrap">
                        {selectedBooking.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-primary/20">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-6 py-3 bg-dark border border-primary/30 text-primary font-semibold rounded-lg hover:border-primary hover:bg-primary/10 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={bookingToDelete ? `${bookingToDelete.firstName} ${bookingToDelete.lastName}'s booking` : 'this booking'}
      />
    </div>
  )
}




