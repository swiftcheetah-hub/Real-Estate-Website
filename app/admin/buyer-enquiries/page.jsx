'use client'

import React, { useState, useEffect } from 'react'
import { Mail, X, CheckCircle, Trash2, Eye } from 'lucide-react'
import DeleteConfirmModal from '../../../src/components/admin/DeleteConfirmModal'

export default function BuyerEnquiriesManagement() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [enquiryToDelete, setEnquiryToDelete] = useState(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    fetchEnquiries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchEnquiries = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('No authentication token found')
        return
      }

      const response = await fetch(`${API_URL}/buyers/enquiries/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEnquiries(data)
      } else if (response.status === 401) {
        console.error('Unauthorized - token may be expired')
        localStorage.removeItem('token')
        alert('Your session has expired. Please login again.')
      } else {
        console.error('Error fetching enquiries:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (enquiry) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Please login to mark enquiries as read')
        return
      }

      const response = await fetch(`${API_URL}/buyers/enquiries/${enquiry.id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchEnquiries()
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to mark as read' }))
        alert(`Error: ${error.message || 'Failed to mark as read. Please try again.'}`)
      }
    } catch (error) {
      console.error('Error marking enquiry as read:', error)
      alert('Error marking enquiry as read. Please check your connection and try again.')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Please login to mark enquiries as read')
        return
      }

      const response = await fetch(`${API_URL}/buyers/enquiries/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchEnquiries()
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to mark all as read' }))
        alert(`Error: ${error.message || 'Failed to mark all as read. Please try again.'}`)
      }
    } catch (error) {
      console.error('Error marking all enquiries as read:', error)
      alert('Error marking all enquiries as read. Please check your connection and try again.')
    }
  }

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry)
    setIsDetailModalOpen(true)
    if (!enquiry.isRead) {
      handleMarkAsRead(enquiry)
    }
  }

  const handleDeleteClick = (enquiry) => {
    setEnquiryToDelete(enquiry)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Please login to delete enquiries')
        return
      }

      const response = await fetch(`${API_URL}/buyers/enquiries/${enquiryToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setDeleteModalOpen(false)
        setEnquiryToDelete(null)
        fetchEnquiries()
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to delete enquiry' }))
        alert(`Error: ${error.message || 'Failed to delete enquiry. Please try again.'}`)
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error)
      alert('Error deleting enquiry. Please check your connection and try again.')
    }
  }

  const getInitials = (fullName) => {
    if (!fullName) return 'N/A'
    const parts = fullName.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return fullName.substring(0, 2).toUpperCase()
  }

  const unreadCount = enquiries.filter(e => !e.isRead).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Buyer Enquiry History</h1>
          <p className="text-sm text-gray-400">Manage agent enquiries for buyers.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-primary/20 text-primary border border-primary rounded-lg hover:bg-primary/30 transition-all flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading enquiries...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No enquiries found.</p>
        </div>
      ) : (
        /* Enquiries List */
        <div className="space-y-3">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className={`bg-dark-lighter rounded-xl p-6 border ${
                enquiry.isRead ? 'border-gray-700' : 'border-primary/50'
              } hover:border-primary/70 transition-all`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">
                        {getInitials(enquiry.buyer?.fullName)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {enquiry.agentName} - {enquiry.agencyOffice}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Enquiry for buyer: {getInitials(enquiry.buyer?.fullName)}
                      </p>
                    </div>
                    {!enquiry.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <p className="text-white">{enquiry.agentEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Phone:</span>
                      <p className="text-white">{enquiry.agentPhone}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Preferred Split:</span>
                      <p className="text-white font-semibold">{enquiry.preferredSplit}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Date:</span>
                      <p className="text-white">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewDetails(enquiry)}
                    className="p-2 rounded-lg bg-dark border border-gray-700 text-gray-300 hover:text-primary hover:border-primary transition-all"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {!enquiry.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(enquiry)}
                      className="p-2 rounded-lg bg-dark border border-gray-700 text-gray-300 hover:text-primary hover:border-primary transition-all"
                      title="Mark as Read"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(enquiry)}
                    className="p-2 rounded-lg bg-dark border border-red-700 text-red-400 hover:text-red-300 hover:border-red-600 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-dark-lighter rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-dark-lighter border-b border-gray-700 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-white">Enquiry Details</h2>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false)
                  setSelectedEnquiry(null)
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark border border-gray-700 text-gray-300 hover:text-primary hover:border-primary transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Agent Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Name:</span>
                    <p className="text-white font-semibold">{selectedEnquiry.agentName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Email:</span>
                    <p className="text-white">{selectedEnquiry.agentEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Phone:</span>
                    <p className="text-white">{selectedEnquiry.agentPhone}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Agency Office:</span>
                    <p className="text-white">{selectedEnquiry.agencyOffice}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Preferred Split:</span>
                    <p className="text-white font-semibold text-primary">{selectedEnquiry.preferredSplit}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Buyer Information</h3>
                <div className="bg-dark rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-black font-bold">
                        {getInitials(selectedEnquiry.buyer?.fullName)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {getInitials(selectedEnquiry.buyer?.fullName)}
                      </p>
                      <p className="text-gray-400 text-sm">{selectedEnquiry.buyer?.buyerType}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Budget:</span>
                      <p className="text-white">{selectedEnquiry.buyer?.budgetRange}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Suburbs:</span>
                      <p className="text-white">{selectedEnquiry.buyer?.preferredSuburbs}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-gray-400 text-sm">Enquiry Date:</span>
                <p className="text-white">
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setEnquiryToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Enquiry"
        message={`Are you sure you want to delete this enquiry? This action cannot be undone.`}
      />
    </div>
  )
}



