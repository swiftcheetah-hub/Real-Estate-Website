'use client'

import React, { useState, useEffect } from 'react'
import JourneyCard from '../../../src/components/admin/JourneyCard'
import JourneyModal from '../../../src/components/admin/JourneyModal'
import DeleteConfirmModal from '../../../src/components/admin/DeleteConfirmModal'
import { Calendar } from 'lucide-react'

export default function JourneyManagement() {
  const [journeys, setJourneys] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJourney, setSelectedJourney] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [journeyToDelete, setJourneyToDelete] = useState(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    fetchJourneys()
  }, [])

  const fetchJourneys = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('No authentication token found')
        alert('Please login to access this page')
        return
      }

      const response = await fetch(`${API_URL}/journeys`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setJourneys(data)
      } else if (response.status === 401) {
        console.error('Unauthorized - token may be expired')
        localStorage.removeItem('token')
        alert('Your session has expired. Please login again.')
      } else {
        console.error('Error fetching journeys:', response.statusText)
        const errorData = await response.json().catch(() => ({}))
        console.error('Error details:', errorData)
      }
    } catch (error) {
      console.error('Error fetching journeys:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (journey = null) => {
    setSelectedJourney(journey)
    setIsModalOpen(true)
  }

  const handleSave = async (formData, isEditMode) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Please login to save milestones')
        return
      }

      let response

      if (isEditMode) {
        response = await fetch(`${API_URL}/journeys/${selectedJourney.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
      } else {
        response = await fetch(`${API_URL}/journeys`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
      }

      if (response.ok) {
        await fetchJourneys()
        setIsModalOpen(false)
        setSelectedJourney(null)
        alert(isEditMode ? 'Milestone updated successfully!' : 'Milestone added successfully!')
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        alert('Your session has expired. Please login again.')
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to save milestone' }))
        throw new Error(error.message || 'Failed to save milestone')
      }
    } catch (error) {
      console.error('Error saving journey:', error)
      alert(`Error saving milestone: ${error.message || 'Please try again.'}`)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedJourney(null)
  }

  const handleDeleteClick = (journey) => {
    setJourneyToDelete(journey)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/journeys/${journeyToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchJourneys()
        setDeleteModalOpen(false)
        setJourneyToDelete(null)
        alert('Milestone deleted successfully!')
      } else {
        throw new Error('Failed to delete milestone')
      }
    } catch (error) {
      console.error('Error deleting journey:', error)
      alert('Error deleting milestone. Please try again.')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setJourneyToDelete(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Journey Management</h1>
          <p className="text-gray-400 text-sm">Manage your company milestones.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading milestones...</div>
        </div>
      </div>
    )
  }

  // Calculate position for the "+" card
  // It should be positioned after all existing cards
  const newCardIndex = journeys.length
  const isNewCardEven = newCardIndex % 2 === 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Journey Management</h1>
        <p className="text-gray-400 text-sm">Manage your company milestones. Click on a milestone card to edit or click the + card to add a new milestone.</p>
      </div>

      {/* Timeline Layout */}
      <div className="relative max-w-4xl mx-auto">
        {/* Vertical Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary/30 hidden md:block" style={{ height: '100%' }} />

        {/* Timeline Items */}
        <div className="space-y-12">
          {journeys.map((journey, idx) => {
            const isEven = idx % 2 === 0
            return (
              <div
                key={journey.id}
                className={`flex items-center gap-8 ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="flex-1">
                  <div
                    onClick={() => handleCardClick(journey)}
                    className="bg-dark-lighter rounded-xl p-6 border border-primary/20 hover:border-primary/40 cursor-pointer transition-all hover:scale-105 group relative"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(journey)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
                      title="Delete Milestone"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    <div className={`text-primary font-bold text-lg mb-2 ${isEven ? 'text-right' : 'text-left'}`}>
                      {journey.year}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{journey.title}</h4>
                    {journey.description && (
                      <p className="text-gray-400">{journey.description}</p>
                    )}
                    
                    {/* Edit Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <div className="flex items-center gap-2 text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="font-semibold">Edit Milestone</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Timeline Dot */}
                <div className="w-4 h-4 bg-primary rounded-full border-4 border-dark z-10 flex-shrink-0 hidden md:block" />
                
                {/* Empty Space */}
                <div className="flex-1 hidden md:block" />
              </div>
            )
          })}

          {/* Add New Card - Positioned in Timeline */}
          <div
            className={`flex items-center gap-8 ${
              isNewCardEven ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className="flex-1">
              <div
                onClick={() => handleCardClick(null)}
                className="bg-dark-lighter rounded-xl p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 cursor-pointer transition-all hover:scale-105 group relative"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-lg font-bold text-primary mb-2">+</div>
                  <div className="text-white font-semibold text-lg mb-1 text-center">Add New Milestone</div>
                  <div className="text-gray-400 text-sm text-center">Click to add</div>
                </div>
              </div>
            </div>
            
            {/* Timeline Dot for New Card */}
            <div className="w-4 h-4 bg-primary/50 rounded-full border-4 border-dark z-10 flex-shrink-0 hidden md:block border-dashed" />
            
            {/* Empty Space */}
            <div className="flex-1 hidden md:block" />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {journeys.length === 0 && (
        <div className="bg-dark-lighter rounded-xl p-10 border border-primary/20 text-center">
          <p className="text-gray-400 mb-3 text-sm">No milestones added yet.</p>
          <p className="text-xs text-gray-500">Click the + card above to add your first milestone.</p>
        </div>
      )}

      <JourneyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        journey={selectedJourney}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={journeyToDelete?.title || 'this milestone'}
      />
    </div>
  )
}

