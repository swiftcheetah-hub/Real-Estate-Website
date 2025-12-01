'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Upload, Image as ImageIcon, Save, Edit2, Trash2, Home, Building2 } from 'lucide-react'

const GalleryModal = ({ isOpen, onClose, galleryItem = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Interior',
    imageUrl: '',
    displayOrder: 0,
    isActive: true,
  })

  const [previewImage, setPreviewImage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)
  const isEditMode = !!galleryItem

  useEffect(() => {
    if (isOpen) {
      if (galleryItem) {
        setFormData({
          name: galleryItem.name || '',
          role: galleryItem.role || 'Interior',
          imageUrl: galleryItem.imageUrl || '',
          displayOrder: galleryItem.displayOrder || 0,
          isActive: galleryItem.isActive !== undefined ? galleryItem.isActive : true,
        })
        setPreviewImage(galleryItem.imageUrl || '')
        setImageFile(null)
      } else {
        setFormData({
          name: '',
          role: 'Interior',
          imageUrl: '',
          displayOrder: 0,
          isActive: true,
        })
        setPreviewImage('')
        setImageFile(null)
      }
      setUploadError('')
    }
  }, [galleryItem, isOpen])

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
      displayOrder: parseInt(formData.displayOrder) || 0,
      imageFile: imageFile,
    }

    onSave(processedData, isEditMode)
  }

  const handleClose = () => {
    setFormData({
      name: '',
      role: 'Interior',
      imageUrl: '',
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
                <h2 className="text-2xl font-bold text-white">Edit Gallery Item</h2>
              </>
            ) : (
              <>
                <ImageIcon className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Add New Gallery Item</h2>
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
                  placeholder="Modern Living Room"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Role/Type *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="Interior">Interior</option>
                  <option value="Exterior">Exterior</option>
                </select>
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

          {/* Image Upload */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Gallery Image *
            </h3>
            <div
              className={`relative w-full h-64 flex items-center justify-center border-2 ${
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
                    alt="Gallery Preview"
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
                    required={!isEditMode}
                  />
                </label>
              )}
              {uploadError && (
                <p className="absolute bottom-2 text-red-400 text-sm">{uploadError}</p>
              )}
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
              {isEditMode ? 'Save Changes' : 'Add Gallery Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GalleryModal

