'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FileText, Upload, Trash2, Eye, Download as DownloadIcon, CheckCircle, XCircle, Edit2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DeleteConfirmModal from '../../../src/components/admin/DeleteConfirmModal'

export default function FreeGuideManagement() {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [guideToDelete, setGuideToDelete] = useState(null)
  const fileInputRef = useRef(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileName: '',
    fileSize: 0,
    isActive: true,
  })
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    fetchGuides()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchGuides = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch('/api/free-guide', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setGuides(data)
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error fetching guides:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Store file reference - will be uploaded when saving
    setSelectedFile(file)
    setFormData({
      ...formData,
      fileName: file.name,
      fileSize: file.size,
    })
  }

  const handleOpenModal = (guide = null) => {
    if (guide) {
      setSelectedGuide(guide)
      setFormData({
        title: guide.title,
        description: guide.description || '',
        fileUrl: guide.fileUrl,
        fileName: guide.fileName,
        fileSize: guide.fileSize || 0,
        isActive: guide.isActive,
      })
      setSelectedFile(null)
    } else {
      setSelectedGuide(null)
      setFormData({
        title: '',
        description: '',
        fileUrl: '',
        fileName: '',
        fileSize: 0,
        isActive: true,
      })
      setSelectedFile(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedGuide(null)
    setSelectedFile(null)
    setFormData({
      title: '',
      description: '',
      fileUrl: '',
      fileName: '',
      fileSize: 0,
      isActive: true,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      if (!formData.title) {
        alert('Please fill in the title.')
        return
      }

      if (!selectedGuide && !selectedFile) {
        alert('Please select a file to upload.')
        return
      }

      const saveFormData = new FormData()
      saveFormData.append('title', formData.title)
      if (formData.description) {
        saveFormData.append('description', formData.description)
      }
      saveFormData.append('isActive', formData.isActive ? 'true' : 'false')

      // If there's a new file, upload it
      if (selectedFile) {
        saveFormData.append('file', selectedFile)
      } else if (formData.fileUrl && selectedGuide) {
        // Keep existing file when editing without new file
        saveFormData.append('fileUrl', formData.fileUrl)
        saveFormData.append('fileName', formData.fileName)
      }

      // For file uploads, we need to handle it differently
      // Since we're using JSON database, we'll need to convert file to base64 or use a file URL
      // For now, let's handle it by converting the file to a data URL or requiring a file URL
      let requestBody
      let headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }

      if (selectedFile) {
        // Convert file to base64 for storage (or you could upload to a file service)
        const reader = new FileReader()
        const fileData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(selectedFile)
        })
        
        requestBody = JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          fileUrl: fileData, // Store as data URL (or upload to cloud storage)
          fileName: formData.fileName,
          fileSize: formData.fileSize,
          isActive: formData.isActive,
        })
      } else {
        // Update existing guide without new file
        requestBody = JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          fileUrl: formData.fileUrl,
          fileName: formData.fileName,
          fileSize: formData.fileSize,
          isActive: formData.isActive,
        })
      }

      const url = selectedGuide
        ? `/api/free-guide/${selectedGuide.id}`
        : '/api/free-guide'
      const method = selectedGuide ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers,
        body: requestBody,
      })

      if (response.ok) {
        await fetchGuides()
        handleCloseModal()
        alert(selectedGuide ? 'Guide updated successfully!' : 'Guide created successfully!')
      } else {
        const error = await response.json().catch(() => ({ message: 'Failed to save guide' }))
        alert(`Error: ${error.message || 'Failed to save guide. Please try again.'}`)
      }
    } catch (error) {
      console.error('Error saving guide:', error)
      alert('Error saving guide. Please try again.')
    }
  }

  const handleDeleteClick = (guide) => {
    setGuideToDelete(guide)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch(`/api/free-guide/${guideToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchGuides()
        setDeleteModalOpen(false)
        setGuideToDelete(null)
        alert('Guide deleted successfully!')
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/admin/login')
      } else {
        throw new Error('Failed to delete guide')
      }
    } catch (error) {
      console.error('Error deleting guide:', error)
      alert(`Error deleting guide: ${error.message || 'Please try again.'}`)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setGuideToDelete(null)
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Free Guide Management</h1>
          <p className="text-gray-400 text-sm">Manage downloadable guides for users.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading guides...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Free Guide Management</h1>
          <p className="text-gray-400 text-sm">Upload and manage downloadable guides for users.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload New Guide
        </button>
      </div>

      {/* Guides List */}
      <div className="space-y-4">
        {guides.length === 0 ? (
          <div className="bg-dark-lighter rounded-xl p-10 border border-primary/20 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-3 text-sm">No guides uploaded yet.</p>
            <p className="text-xs text-gray-500">Click &quot;Upload New Guide&quot; to add your first guide.</p>
          </div>
        ) : (
          guides.map((guide) => (
            <div
              key={guide.id}
              className={`bg-dark-lighter rounded-xl p-6 border ${
                guide.isActive ? 'border-primary/40' : 'border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="text-xl font-bold text-white">{guide.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {guide.isActive ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs font-semibold rounded">
                            Inactive
                          </span>
                        )}
                        <span className="text-gray-500 text-xs">
                          {guide.downloadCount || 0} downloads
                        </span>
                      </div>
                    </div>
                  </div>

                  {guide.description && (
                    <p className="text-gray-400 text-sm mb-3">{guide.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>File: {guide.fileName}</span>
                    {guide.fileSize && <span>Size: {formatFileSize(guide.fileSize)}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleOpenModal(guide)}
                    className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(guide)}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload/Edit Modal */}
      {isModalOpen && (
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
          onClick={handleCloseModal}
        >
          <div
            className="bg-dark-lighter rounded-xl border border-primary/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-dark-lighter border-b border-primary/20 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {selectedGuide ? 'Edit Guide' : 'Upload New Guide'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-dark transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Luxury Real Estate Investment Guide"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors resize-none"
                  rows={4}
                  placeholder="Guide description..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Guide File <span className="text-red-500">*</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary-dark"
                />
                {formData.fileName && (
                  <p className="mt-2 text-sm text-gray-400">
                    {selectedFile ? 'New file selected: ' : 'Current file: '}
                    {formData.fileName}
                    {formData.fileSize && ` (${formatFileSize(formData.fileSize)})`}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary bg-dark border-primary/20 rounded focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">
                  Active (visible to users)
                </label>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-primary/20">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-dark border border-primary/30 text-primary font-semibold rounded-lg hover:border-primary hover:bg-primary/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all"
                >
                  {selectedGuide ? 'Update Guide' : 'Upload Guide'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={guideToDelete?.title || 'this guide'}
      />
    </div>
  )
}

