'use client'

import React, { useEffect } from 'react'
import { X, AlertTriangle, Trash2 } from 'lucide-react'

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
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
      <div className="bg-dark-lighter rounded-xl border border-primary/20 w-full max-w-md">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-gray-300 mb-2">
            Are you sure you want to delete <span className="font-semibold text-white">{itemName}</span>?
          </p>
          <p className="text-sm text-gray-400">
            This action cannot be undone. All associated data will be permanently removed.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-primary/20 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-dark border border-primary/30 text-primary font-semibold rounded-lg hover:border-primary hover:bg-primary/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal

