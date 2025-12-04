'use client'

import React, { useState, useEffect } from 'react'
import GalleryCard from '../../../src/components/admin/GalleryCard'
import GalleryModal from '../../../src/components/admin/GalleryModal'
import DeleteConfirmModal from '../../../src/components/admin/DeleteConfirmModal'

export default function GalleryManagement() {
  const [galleryItems, setGalleryItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    fetchGalleryItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchGalleryItems = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('No authentication token found')
        return
      }

      const response = await fetch('/api/gallery', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setGalleryItems(data)
      } else if (response.status === 401) {
        console.error('Unauthorized - token may be expired')
        localStorage.removeItem('token')
        alert('Your session has expired. Please login again.')
      } else {
        console.error('Error fetching gallery items:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (galleryItem = null) => {
    setSelectedGalleryItem(galleryItem)
    setIsModalOpen(true)
  }

  const handleSave = async (formData, isEditMode) => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('Please login to save gallery items')
        return
      }

      const saveFormData = new FormData()
      saveFormData.append('name', formData.name)
      saveFormData.append('role', formData.role)
      saveFormData.append('displayOrder', formData.displayOrder || 0)
      saveFormData.append('isActive', formData.isActive ? 'true' : 'false')
      
      // Determine mediaType based on what's uploaded
      let mediaType = 'image'
      if (formData.videoFile || formData.videoUrl) {
        mediaType = 'video'
      } else if (formData.imageFile || formData.imageUrl) {
        mediaType = 'image'
      }
      saveFormData.append('mediaType', mediaType)

      // Upload image file if provided
      if (formData.imageFile) {
        saveFormData.append('files', formData.imageFile)
      }

      // Upload video file if provided
      if (formData.videoFile) {
        saveFormData.append('files', formData.videoFile)
      }

      // If editing and no new files, keep existing URLs
      if (isEditMode && !formData.imageFile && !formData.videoFile) {
        if (formData.imageUrl) {
          saveFormData.append('imageUrl', formData.imageUrl)
        }
        if (formData.videoUrl) {
          saveFormData.append('videoUrl', formData.videoUrl)
        }
      }

      let response
      const method = isEditMode ? 'PATCH' : 'POST'
      const url = isEditMode
        ? `/api/gallery/${selectedGalleryItem.id}`
        : '/api/gallery'

      response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: saveFormData,
      })

      if (response.ok) {
        await fetchGalleryItems()
        setIsModalOpen(false)
        setSelectedGalleryItem(null)
        alert(isEditMode ? 'Gallery item updated successfully!' : 'Gallery item added successfully!')
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        alert('Your session has expired. Please login again.')
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to save gallery item' }))
        throw new Error(error.message || 'Failed to save gallery item')
      }
    } catch (error) {
      console.error('Error saving gallery item:', error)
      alert(`Error saving gallery item: ${error.message || 'Please try again.'}`)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedGalleryItem(null)
  }

  const handleDeleteClick = (galleryItem) => {
    setItemToDelete(galleryItem)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/gallery/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchGalleryItems()
        setDeleteModalOpen(false)
        setItemToDelete(null)
        alert('Gallery item deleted successfully!')
      } else {
        throw new Error('Failed to delete gallery item')
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error)
      alert('Error deleting gallery item. Please try again.')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setItemToDelete(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Gallery Management</h1>
          <p className="text-gray-400 text-sm">Manage property gallery images.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading gallery items...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Gallery Management</h1>
        <p className="text-gray-400 text-sm">Manage property gallery images. Click on a gallery item to edit or click the + card to add a new item.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {galleryItems.map((item) => (
          <GalleryCard
            key={item.id}
            galleryItem={item}
            onClick={() => handleCardClick(item)}
            onDelete={handleDeleteClick}
          />
        ))}

        <GalleryCard isNew onClick={() => handleCardClick(null)} />
      </div>

      {galleryItems.length === 0 && (
        <div className="bg-dark-lighter rounded-xl p-10 border border-primary/20 text-center">
          <p className="text-gray-400 mb-3 text-sm">No gallery items added yet.</p>
          <p className="text-xs text-gray-500">Click the + card above to add your first gallery item.</p>
        </div>
      )}

      <GalleryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        galleryItem={selectedGalleryItem}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.name || 'this gallery item'}
      />
    </div>
  )
}

