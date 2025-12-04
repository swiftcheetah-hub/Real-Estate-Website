'use client'

import React, { useState, useEffect } from 'react'
import InvestorCard from '../../../src/components/admin/InvestorCard'
import InvestorModal from '../../../src/components/admin/InvestorModal'
import DeleteConfirmModal from '../../../src/components/admin/DeleteConfirmModal'

export default function InvestorManagement() {
  const [investors, setInvestors] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInvestor, setSelectedInvestor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [investorToDelete, setInvestorToDelete] = useState(null)

  useEffect(() => {
    fetchInvestors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchInvestors = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('No authentication token found')
        return
      }

      const response = await fetch('/api/investors', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInvestors(data)
      } else if (response.status === 401) {
        console.error('Unauthorized - token may be expired')
        localStorage.removeItem('token')
        alert('Your session has expired. Please login again.')
      } else {
        console.error('Error fetching investors:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching investors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (investor = null) => {
    setSelectedInvestor(investor)
    setIsModalOpen(true)
  }

  const handleSave = async (formData, isEditMode) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Please login to save investors')
        return
      }

      let imageUrl = formData.imageUrl

      // Upload image if file is provided
      if (formData.imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('image', formData.imageFile)

        const uploadResponse = await fetch('/api/upload/image', {
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

      const { imageFile, ...investorData } = formData
      const payload = { ...investorData, imageUrl }

      let response

      if (isEditMode) {
        response = await fetch(`/api/investors/${selectedInvestor.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch('/api/investors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })
      }

      if (response.ok) {
        await fetchInvestors()
        setIsModalOpen(false)
        setSelectedInvestor(null)
        alert(isEditMode ? 'Investor updated successfully!' : 'Investor added successfully!')
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        alert('Your session has expired. Please login again.')
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to save investor' }))
        throw new Error(error.message || 'Failed to save investor')
      }
    } catch (error) {
      console.error('Error saving investor:', error)
      alert(`Error saving investor: ${error.message || 'Please try again.'}`)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedInvestor(null)
  }

  const handleDeleteClick = (investor) => {
    setInvestorToDelete(investor)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/investors/${investorToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchInvestors()
        setDeleteModalOpen(false)
        setInvestorToDelete(null)
        alert('Investor deleted successfully!')
      } else {
        throw new Error('Failed to delete investor')
      }
    } catch (error) {
      console.error('Error deleting investor:', error)
      alert('Error deleting investor. Please try again.')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setInvestorToDelete(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Investor Management</h1>
          <p className="text-gray-400 text-sm">Manage investor testimonials.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading investors...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Investor Management</h1>
        <p className="text-gray-400 text-sm">Manage investor testimonials. Click on an investor card to edit or click the + card to add a new investor.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {investors.map((investor) => (
          <InvestorCard
            key={investor.id}
            investor={investor}
            onClick={() => handleCardClick(investor)}
            onDelete={handleDeleteClick}
          />
        ))}

        <InvestorCard isNew onClick={() => handleCardClick(null)} />
      </div>

      {investors.length === 0 && (
        <div className="bg-dark-lighter rounded-xl p-10 border border-primary/20 text-center">
          <p className="text-gray-400 mb-3 text-sm">No investors added yet.</p>
          <p className="text-xs text-gray-500">Click the + card above to add your first investor.</p>
        </div>
      )}

      <InvestorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        investor={selectedInvestor}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={investorToDelete?.name || 'this investor'}
      />
    </div>
  )
}

