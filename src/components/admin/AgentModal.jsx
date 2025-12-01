'use client'

import React, { useState, useEffect } from 'react'
import { X, Upload, UserPlus, Save, Edit2 } from 'lucide-react'

const AgentModal = ({ isOpen, onClose, agent = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    imageUrl: '',
    description: '',
    education: '',
    specialties: '',
    certifications: '',
    achievements: '',
  })

  const [previewImage, setPreviewImage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const isEditMode = !!agent

  // Load agent data when editing
  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || '',
        role: agent.role || '',
        email: agent.email || '',
        phone: agent.phone || '',
        imageUrl: agent.imageUrl || '',
        description: agent.description || '',
        education: agent.education || '',
        specialties: agent.specialties ? agent.specialties.join(', ') : '',
        certifications: agent.certifications ? agent.certifications.join(', ') : '',
        achievements: agent.achievements ? agent.achievements.join(', ') : '',
      })
      // If agent has existing image URL, show it in preview
      setPreviewImage(agent.imageUrl || '')
      setImageFile(null)
    } else {
      // Reset form for new agent
      setFormData({
        name: '',
        role: '',
        email: '',
        phone: '',
        imageUrl: '',
        description: '',
        education: '',
        specialties: '',
        certifications: '',
        achievements: '',
      })
      setPreviewImage('')
      setImageFile(null)
    }
  }, [agent, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  const handleFileSelect = (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setImageFile(file)

    // Create preview and set as imageUrl (base64 data URL)
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      setPreviewImage(base64String)
      setFormData((prev) => ({ ...prev, imageUrl: base64String })) // Set base64 as URL for now
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage('')
    setImageFile(null)
    setFormData((prev) => ({ ...prev, imageUrl: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Process form data
    const processedData = {
      ...formData,
      specialties: formData.specialties
        ? formData.specialties.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      certifications: formData.certifications
        ? formData.certifications.split(',').map((c) => c.trim()).filter(Boolean)
        : [],
      achievements: formData.achievements
        ? formData.achievements.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
      imageFile: imageFile, // Include the file for upload
    }

    onSave(processedData, isEditMode)
  }

  const handleClose = () => {
    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      imageUrl: '',
      description: '',
      education: '',
      specialties: '',
      certifications: '',
      achievements: '',
    })
    setPreviewImage('')
    setImageFile(null)
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
      <div className="bg-dark-lighter rounded-xl border border-primary/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-dark-lighter border-b border-primary/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <>
                <Edit2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Edit Agent</h2>
              </>
            ) : (
              <>
                <UserPlus className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Register New Agent</h2>
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Role/Title *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Senior Real Estate Agent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Profile Image
            </h3>
            
            {/* Upload Area with Preview */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg transition-all relative overflow-hidden ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-primary/30 hover:border-primary/50'
              } ${previewImage ? 'p-0' : 'p-6'}`}
            >
              {previewImage ? (
                // Show preview image
                <div className="relative w-full h-64">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  {/* Overlay with controls */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                    <div className="text-center text-white mb-2">
                      {imageFile && (
                        <p className="text-sm font-semibold mb-1">{imageFile.name}</p>
                      )}
                      <p className="text-xs text-gray-300">Click to change image</p>
                    </div>
                    <label className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      Change Image
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-6 py-3 bg-red-500/80 text-white font-semibold rounded-lg hover:bg-red-500 transition-all"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                // Show upload interface
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold mb-1">
                      Drag & drop an image here, or click to select
                    </p>
                    <p className="text-gray-400 text-sm">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <label className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Description/Bio *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Enter a detailed description about the agent..."
            />
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="MBA, Harvard Business School"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Specialties (comma-separated)
                </label>
                <input
                  type="text"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Luxury Residential, Investment Properties"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Certified Luxury Home Marketing Specialist"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Achievements (comma-separated)
                </label>
                <input
                  type="text"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Top 1% of agents nationwide, $150M+ in career sales"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
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
              {isEditMode ? 'Save Changes' : 'Register Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AgentModal

