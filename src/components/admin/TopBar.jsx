'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, ChevronDown, UserPlus, LogOut } from 'lucide-react'
import MessageBox from './MessageBox'

const TopBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [siteSettings, setSiteSettings] = useState(null)
  const [adminProfile, setAdminProfile] = useState(null)
  const dropdownRef = useRef(null)
  const router = useRouter()

  // Fetch site settings and admin profile
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Fetch site settings
      fetch('/api/site-settings', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setSiteSettings(data))
        .catch(err => console.error('Error fetching site settings:', err))

      // Fetch admin profile
      fetch('/api/admin/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setAdminProfile(data))
        .catch(err => console.error('Error fetching admin profile:', err))
    }
  }, [])

  // Get first letter of admin's full name
  const getInitial = () => {
    if (adminProfile?.fullName) {
      return adminProfile.fullName.charAt(0).toUpperCase()
    }
    return 'A' // Default fallback
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/admin/login')
    setIsDropdownOpen(false)
  }

  const handleAddMyPage = () => {
    router.push('/admin/my-page')
    setIsDropdownOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-dark-lighter border-b border-primary/20 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left - Logo */}
        <Link href="/admin" className="flex items-center space-x-2">
          {siteSettings?.logoUrl ? (
            <img
              src={siteSettings.logoUrl}
              alt={siteSettings.siteName || 'Logo'}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-black" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">Admin Panel</span>
            <span className="text-xs text-gray-400">{siteSettings?.siteName || 'Elite Properties'}</span>
          </div>
        </Link>

        {/* Right - Message Box & Avatar & Dropdown */}
        <div className="flex items-center gap-4">
          <MessageBox />
          
          <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-dark transition-colors"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-primary/30">
              <span className="text-black font-bold text-sm">{getInitial()}</span>
            </div>
            {/* Dropdown Icon */}
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-dark-lighter rounded-lg border border-primary/20 shadow-xl overflow-hidden">
              <div className="py-2">
                <button
                  onClick={handleAddMyPage}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-300 hover:bg-dark hover:text-primary transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Add My Page</span>
                </button>
                <div className="border-t border-primary/20 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-400 hover:bg-dark hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar

