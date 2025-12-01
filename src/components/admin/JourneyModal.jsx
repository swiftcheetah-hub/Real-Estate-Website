'use client'

import React, { useState, useEffect } from 'react'
import { X, Calendar, Save, Edit2 } from 'lucide-react'

const JourneyModal = ({ isOpen, onClose, journey = null, onSave }) => {
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    displayOrder: 0,
    isActive: true,
  })

  const isEditMode = !!journey

  useEffect(() => {
    if (journey) {
      setFormData({
        year: journey.year || '',
        title: journey.title || '',
        description: journey.description || '',
        displayOrder: journey.displayOrder || 0,
        isActive: journey.isActive !== undefined ? journey.isActive : true,
      })
    } else {
      setFormData({
        year: '',
        title: '',
        description: '',
        displayOrder: 0,
        isActive: true,
      })
    }
  }, [journey, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const processedData = {
      ...formData,
      displayOrder: parseInt(formData.displayOrder) || 0,
    }

    onSave(processedData, isEditMode)
  }

  const handleClose = () => {
    setFormData({
      year: '',
      title: '',
      description: '',
      displayOrder: 0,
      isActive: true,
    })
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      // Ensure modal covers full viewport
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
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
    >
      <div className="bg-dark-lighter rounded-xl border border-primary/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-lighter border-b border-primary/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <>
                <Edit2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Edit Milestone</h2>
              </>
            ) : (
              <>
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Add New Milestone</h2>
              </>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-dark transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Milestone Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Year *
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="2010"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Display Order
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Founded Elite Properties"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Started with a vision to redefine luxury real estate"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-primary/20 bg-dark text-primary focus:ring-primary focus:ring-offset-dark"
                  />
                  <span className="text-sm font-semibold text-gray-300">Active</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-primary/20">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-dark border border-primary/30 text-primary font-semibold rounded-lg hover:border-primary hover:bg-primary/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isEditMode ? 'Save Changes' : 'Add Milestone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JourneyModal

