'use client'

import React, { useState, useEffect } from 'react'
import ReviewCard from '../../../src/components/admin/ReviewCard'
import ReviewModal from '../../../src/components/admin/ReviewModal'
import DeleteConfirmModal from '../../../src/components/admin/DeleteConfirmModal'

export default function ReviewManagement() {
  const [reviews, setReviews] = useState([])
  const [agents, setAgents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    fetchReviews()
    fetchAgents()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('No authentication token found')
        return
      }

      const response = await fetch(`${API_URL}/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      } else if (response.status === 401) {
        console.error('Unauthorized - token may be expired')
        localStorage.removeItem('token')
        alert('Your session has expired. Please login again.')
      } else {
        console.error('Error fetching reviews:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
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

  const handleCardClick = (review = null) => {
    setSelectedReview(review)
    setIsModalOpen(true)
  }

  const handleSave = async (formData, isEditMode) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Please login to save reviews')
        return
      }

      let imageUrl = formData.imageUrl

      // Upload image if file is provided
      if (formData.imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('image', formData.imageFile)

        const uploadResponse = await fetch(`${API_URL}/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: uploadFormData,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.url
        }
      }

      const { imageFile, ...reviewData } = formData
      const payload = { ...reviewData, imageUrl, agentId: reviewData.agentId || null }

      let response

      if (isEditMode) {
        response = await fetch(`${API_URL}/reviews/${selectedReview.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch(`${API_URL}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
      }

      if (response.ok) {
        await fetchReviews()
        setIsModalOpen(false)
        setSelectedReview(null)
        alert(isEditMode ? 'Review updated successfully!' : 'Review added successfully!')
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        alert('Your session has expired. Please login again.')
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to save review' }))
        throw new Error(error.message || 'Failed to save review')
      }
    } catch (error) {
      console.error('Error saving review:', error)
      alert(`Error saving review: ${error.message || 'Please try again.'}`)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedReview(null)
  }

  const handleDeleteClick = (review) => {
    setReviewToDelete(review)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/reviews/${reviewToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchReviews()
        setDeleteModalOpen(false)
        setReviewToDelete(null)
        alert('Review deleted successfully!')
      } else {
        throw new Error('Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Error deleting review. Please try again.')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setReviewToDelete(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Review Management</h1>
          <p className="text-gray-400 text-sm">Manage client testimonials.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading reviews...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Review Management</h1>
        <p className="text-gray-400 text-sm">Manage client testimonials. Click on a review card to edit or click the + card to add a new review.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onClick={() => handleCardClick(review)}
            onDelete={handleDeleteClick}
          />
        ))}

        <ReviewCard isNew onClick={() => handleCardClick(null)} />
      </div>

      {reviews.length === 0 && (
        <div className="bg-dark-lighter rounded-xl p-10 border border-primary/20 text-center">
          <p className="text-gray-400 mb-3 text-sm">No reviews added yet.</p>
          <p className="text-xs text-gray-500">Click the + card above to add your first review.</p>
        </div>
      )}

      <ReviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        review={selectedReview}
        agents={agents}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={reviewToDelete?.name || 'this review'}
      />
    </div>
  )
}

