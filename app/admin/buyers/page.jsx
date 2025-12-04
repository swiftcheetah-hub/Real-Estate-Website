'use client'

import React, { useState, useEffect } from 'react'
import BuyerCard from '../../../src/components/admin/BuyerCard'
import BuyerModal from '../../../src/components/admin/BuyerModal'
import DeleteConfirmModal from '../../../src/components/admin/DeleteConfirmModal'

export default function BuyerManagement() {
  const [buyers, setBuyers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBuyer, setSelectedBuyer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [buyerToDelete, setBuyerToDelete] = useState(null)

  useEffect(() => {
    fetchBuyers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchBuyers = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('No authentication token found. Please login again.')
        return
      }

      const response = await fetch('/api/buyers/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBuyers(data)
      } else if (response.status === 401) {
        setError('Your session has expired. Please login again.')
        localStorage.removeItem('token')
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch buyers' }))
        setError(errorData.message || 'Failed to fetch buyers. Please try again.')
      }
    } catch (error) {
      console.error('Error fetching buyers:', error)
      setError('Unable to connect to the server. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (buyer = null) => {
    setSelectedBuyer(buyer)
    setIsModalOpen(true)
  }

  const handleSave = async (formData, isEditMode) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Please login to save buyers')
        return
      }

      let response

      if (isEditMode) {
        response = await fetch(`/api/buyers/${selectedBuyer.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
      } else {
        response = await fetch('/api/buyers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
      }

      if (response.ok) {
        setIsModalOpen(false)
        setSelectedBuyer(null)
        fetchBuyers()
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to save buyer' }))
        alert(`Error: ${error.message || 'Failed to save buyer. Please try again.'}`)
      }
    } catch (error) {
      console.error('Error saving buyer:', error)
      alert('Error saving buyer. Please check your connection and try again.')
    }
  }

  const handleDeleteClick = (buyer) => {
    setBuyerToDelete(buyer)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Please login to delete buyers')
        return
      }

      const response = await fetch(`/api/buyers/${buyerToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setDeleteModalOpen(false)
        setBuyerToDelete(null)
        fetchBuyers()
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to delete buyer' }))
        alert(`Error: ${error.message || 'Failed to delete buyer. Please try again.'}`)
      }
    } catch (error) {
      console.error('Error deleting buyer:', error)
      alert('Error deleting buyer. Please check your connection and try again.')
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Match Buyer Management</h1>
        <p className="text-sm text-gray-400">Manage registered buyers and their preferences.</p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading buyers...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-2">Error loading buyers</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchBuyers}
            className="px-6 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all"
          >
            Retry
          </button>
        </div>
      ) : (
        /* Buyers Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {buyers.length > 0 ? (
            <>
              {buyers.map((buyer) => (
                <BuyerCard
                  key={buyer.id}
                  buyer={buyer}
                  onClick={() => handleCardClick(buyer)}
                  onDelete={handleDeleteClick}
                />
              ))}
              <BuyerCard isNew onClick={() => handleCardClick(null)} />
            </>
          ) : (
            <>
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400">No buyers found. Click the + card to add a new buyer.</p>
              </div>
              <BuyerCard isNew onClick={() => handleCardClick(null)} />
            </>
          )}
        </div>
      )}

      {/* Modals */}
      <BuyerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedBuyer(null)
        }}
        buyer={selectedBuyer}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setBuyerToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Buyer"
        message={`Are you sure you want to delete this buyer? This action cannot be undone.`}
      />
    </div>
  )
}

