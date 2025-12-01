'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Upload, Home, Save, Edit2, Image as ImageIcon, Trash2, Plus, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

const PropertyModal = ({ isOpen, onClose, property = null, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    areaUnit: 'sqft',
    floor: '',
    landSize: '',
    yearBuilt: '',
    type: '',
    status: '',
    description: '',
    features: '',
    agentId: '',
    isActive: true,
    isFeatured: false,
    displayOrder: 0,
  })

  const [imageFiles, setImageFiles] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [agents, setAgents] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)
  const isEditMode = !!property
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    if (isOpen) {
      if (property) {
        setFormData({
          title: property.title || '',
          address: property.address || '',
          price: property.price ? parseFloat(property.price).toString() : '',
          bedrooms: property.bedrooms?.toString() || '',
          bathrooms: property.bathrooms?.toString() || '',
          area: property.area?.toString() || '',
          areaUnit: property.areaUnit || 'sqft',
          floor: property.floor?.toString() || '',
          landSize: property.landSize || '',
          yearBuilt: property.yearBuilt?.toString() || '',
          type: property.type || '',
          status: property.status || '',
          description: property.description || '',
          features: property.features ? property.features.join(', ') : '',
          agentId: property.agentId || '',
          isActive: property.isActive !== undefined ? property.isActive : true,
          isFeatured: property.isFeatured !== undefined ? property.isFeatured : false,
          displayOrder: property.displayOrder || 0,
        })
        setExistingImages(property.images || [])
        setPreviewImages([])
        setImageFiles([])
      } else {
        setFormData({
          title: '',
          address: '',
          price: '',
          bedrooms: '',
          bathrooms: '',
          area: '',
          areaUnit: 'sqft',
          floor: '',
          landSize: '',
          yearBuilt: '',
          type: '',
          status: '',
          description: '',
          features: '',
          agentId: '',
          isActive: true,
          isFeatured: false,
          displayOrder: 0,
        })
        setExistingImages([])
        setPreviewImages([])
        setImageFiles([])
      }
      setUploadError('')
    }
  }, [property, isOpen])

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/admin/login')
          return
        }
        const response = await fetch(`${API_URL}/agents`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setAgents(data)
        } else if (response.status === 401) {
          localStorage.removeItem('token')
          router.push('/admin/login')
        } else {
          console.error('Failed to fetch agents:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching agents:', error)
      }
    }
    if (isOpen) {
      fetchAgents()
    }
  }, [isOpen, API_URL, router])

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
    const files = Array.from(e.target.files || [])
    processFiles(files)
  }

  const processFiles = (files) => {
    setUploadError('')
    const validFiles = []
    const newPreviews = []

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed.')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size cannot exceed 5MB.')
        return
      }
      validFiles.push(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result)
        if (newPreviews.length === validFiles.length) {
          setPreviewImages((prev) => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    setImageFiles((prev) => [...prev, ...validFiles])
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
    const files = Array.from(e.dataTransfer.files || [])
    processFiles(files)
  }

  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index))
    } else {
      setPreviewImages((prev) => prev.filter((_, i) => i !== index))
      setImageFiles((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...formData, imageFiles, existingImages }, isEditMode)
  }

  const handleClose = () => {
    setFormData({
      title: '',
      address: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      areaUnit: 'sqft',
      floor: '',
      landSize: '',
      yearBuilt: '',
      type: '',
      status: '',
      description: '',
      features: '',
      agentId: '',
      isActive: true,
      isFeatured: false,
      displayOrder: 0,
    })
    setExistingImages([])
    setPreviewImages([])
    setImageFiles([])
    setUploadError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  if (!isOpen) return null

  const allImages = [...existingImages, ...previewImages]

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
      <div className="bg-dark-lighter rounded-xl border border-primary/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-lighter border-b border-primary/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <>
                <Edit2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Edit Property</h2>
              </>
            ) : (
              <>
                <Home className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Add New Property</h2>
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
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Modern Luxury Villa"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="1234 Sunset Boulevard, Beverly Hills, CA 90210"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="2500000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select type</option>
                  <option value="houses">Houses</option>
                  <option value="apartments">Apartments</option>
                  <option value="villas">Villas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="4"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Area (Square Feet)
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="4500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Area Unit
                </label>
                <select
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="sqft">Square Feet</option>
                  <option value="sqm">Square Meters</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Floors
                </label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Land Size
                </label>
                <input
                  type="text"
                  name="landSize"
                  value={formData.landSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="0.5 acres"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Year Built
                </label>
                <input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="2020"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select status</option>
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Agent (Optional)
                </label>
                <select
                  name="agentId"
                  value={formData.agentId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select an agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images Upload */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Property Images
            </h3>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mb-4">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, true)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Preview Images */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mb-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, false)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            <div
              className={`relative w-full h-48 flex items-center justify-center border-2 ${
                isDragging ? 'border-primary' : 'border-primary/20'
              } border-dashed rounded-lg transition-colors duration-200`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-primary transition-colors">
                <ImageIcon className="w-10 h-10 mb-2" />
                <p className="text-lg font-semibold mb-1">Drag & drop images here</p>
                <p className="text-sm mb-2">or click to browse</p>
                <span className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors">
                  Choose Files
                </span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {uploadError && (
                <p className="absolute bottom-2 text-red-400 text-sm">{uploadError}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Enter property description..."
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Features (comma-separated)
            </label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="Swimming Pool, Home Theater, Wine Cellar"
            />
          </div>

          {/* Additional Options */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Additional Options</h3>
            <div className="space-y-3">
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
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-primary/20 bg-dark text-primary focus:ring-primary focus:ring-offset-dark"
                />
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-gray-300">Featured</span>
                </div>
              </label>
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
                />
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
              {isEditMode ? 'Save Changes' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyModal

