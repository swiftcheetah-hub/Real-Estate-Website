'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Upload, Quote, Save, Edit2, Image as ImageIcon, Trash2, Star } from 'lucide-react'

const ReviewModal = ({ isOpen, onClose, review = null, agents = [], onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    imageUrl: '',
    rating: 5,
    text: '',
    property: '',
    agentId: '',
    displayOrder: 0,
    isActive: true,
  })

  const [previewImage, setPreviewImage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)
  const isEditMode = !!review

  useEffect(() => {
    if (isOpen) {
      if (review) {
        setFormData({
          name: review.name || '',
          role: review.role || '',
          imageUrl: review.imageUrl || '',
          rating: review.rating || 5,
          text: review.text || '',
          property: review.property || '',
          agentId: review.agentId || '',
          displayOrder: review.displayOrder || 0,
          isActive: review.isActive !== undefined ? review.isActive : true,
        })
        setPreviewImage(review.imageUrl || '')
        setImageFile(null)
      } else {
        setFormData({
          name: '',
          role: '',
          imageUrl: '',
          rating: 5,
          text: '',
          property: '',
          agentId: '',
          displayOrder: 0,
          isActive: true,
        })
        setPreviewImage('')
        setImageFile(null)
      }
      setUploadError('')
    }
  }, [review, isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file) => {
    setUploadError('')
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size cannot exceed 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result)
      setImageFile(file)
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage('')
    setImageFile(null)
    setFormData((prev) => ({ ...prev, imageUrl: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const processedData = {
      ...formData,
      rating: parseInt(formData.rating) || 5,
      displayOrder: parseInt(formData.displayOrder) || 0,
      agentId: formData.agentId || null,
      imageFile: imageFile,
    }

    onSave(processedData, isEditMode)
  }

  const handleClose = () => {
    setFormData({
      name: '',
      role: '',
      imageUrl: '',
      rating: 5,
      text: '',
      property: '',
      agentId: '',
      displayOrder: 0,
      isActive: true,
    })
    setPreviewImage('')
    setImageFile(null)
    setUploadError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

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
        <div className="sticky top-0 bg-dark-lighter border-b border-primary/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <>
                <Edit2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Edit Review</h2>
              </>
            ) : (
              <>
                <Quote className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Add New Review</h2>
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
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Sina Soth"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Role/Title
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="CEO, Tech Startup"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? 'fill-primary text-primary'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-gray-400 text-sm ml-2">{formData.rating}/5</span>
                </div>
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
                  Agent (Optional)
                </label>
                <select
                  name="agentId"
                  value={formData.agentId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select an agent (optional)</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Property
                </label>
                <input
                  type="text"
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Luxury Villa, Beverly Hills"
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

          {/* Profile Image Upload */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Profile Image
            </h3>
            <div
              className={`relative w-full h-48 flex items-center justify-center border-2 ${
                isDragging ? 'border-primary' : 'border-primary/20'
              } border-dashed rounded-lg transition-colors duration-200 ${
                previewImage ? 'p-0' : 'p-4'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <p className="text-white text-sm mb-2">
                      {imageFile ? imageFile.name : 'Image Preview'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" /> Change Image
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-primary transition-colors">
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <p className="text-lg font-semibold mb-1">Drag & drop image here</p>
                  <p className="text-sm mb-2">or click to browse</p>
                  <span className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
                    Choose File
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
              {uploadError && (
                <p className="absolute bottom-2 text-red-400 text-sm">{uploadError}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Review Text *
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="As a first-time property investor, I really appreciated..."
            />
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
              {isEditMode ? 'Save Changes' : 'Add Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewModal

