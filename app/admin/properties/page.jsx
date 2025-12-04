'use client'

import React, { useState, useEffect } from 'react'
import PropertyCard from '../../../src/components/admin/PropertyCard'
import PropertyModal from '../../../src/components/admin/PropertyModal'
import DeleteConfirmModal from '../../../src/components/admin/DeleteConfirmModal'
import { useRouter } from 'next/navigation'

export default function PropertiesManagement() {
  const [properties, setProperties] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch('/api/properties', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/admin/login')
      } else {
        console.error('Error fetching properties:', response.statusText)
        alert(`Error fetching properties: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      alert('Error fetching properties. Please check your network connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (property = null) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const handleSave = async (formData, isEditMode) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const { imageFiles, existingImages, features, ...propertyData } = formData
      
      // Prepare FormData
      const form = new FormData()
      
      // Add all property fields
      for (const key in propertyData) {
        if (propertyData[key] !== null && propertyData[key] !== undefined && propertyData[key] !== '') {
          form.append(key, propertyData[key])
        }
      }

      // Add features as comma-separated string
      if (features) {
        form.append('features', features)
      }

      // Add existing images as JSON string
      if (existingImages && existingImages.length > 0) {
        form.append('existingImages', JSON.stringify(existingImages))
      }

      // Add new image files
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          form.append('images', file)
        })
      }

      let response
      const method = isEditMode ? 'PATCH' : 'POST'
      const url = isEditMode 
        ? `/api/properties/${selectedProperty.id}` 
        : `/api/properties`

      response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
        body: form,
      })

      if (response.ok) {
        await fetchProperties()
        setIsModalOpen(false)
        setSelectedProperty(null)
        alert(isEditMode ? 'Property updated successfully!' : 'Property added successfully!')
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/admin/login')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save property')
      }
    } catch (error) {
      console.error('Error saving property:', error)
      alert(`Error saving property: ${error.message || 'Please try again.'}`)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProperty(null)
  }

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch(`/api/properties/${propertyToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchProperties()
        setDeleteModalOpen(false)
        setPropertyToDelete(null)
        alert('Property deleted successfully!')
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/admin/login')
      } else {
        throw new Error('Failed to delete property')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      alert(`Error deleting property: ${error.message || 'Please try again.'}`)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setPropertyToDelete(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Properties Management</h1>
          <p className="text-gray-400 text-sm">Manage your featured properties.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading properties...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Properties Management</h1>
        <p className="text-gray-400 text-sm">Manage your featured properties. Click on a property card to edit or click the + card to add a new property.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => handleCardClick(property)}
            onDelete={handleDeleteClick}
          />
        ))}

        <PropertyCard isNew onClick={() => handleCardClick(null)} />
      </div>

      {properties.length === 0 && (
        <div className="bg-dark-lighter rounded-xl p-10 border border-primary/20 text-center">
          <p className="text-gray-400 mb-3 text-sm">No properties added yet.</p>
          <p className="text-xs text-gray-500">Click the + card above to add your first property.</p>
        </div>
      )}

      <PropertyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        property={selectedProperty}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={propertyToDelete?.title || 'this property'}
      />
    </div>
  )
}

