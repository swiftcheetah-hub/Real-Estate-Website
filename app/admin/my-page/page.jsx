'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Image as ImageIcon, Save, Upload, X } from 'lucide-react'

export default function MyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [adminProfile, setAdminProfile] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [siteSettings, setSiteSettings] = useState({
    logoUrl: '',
    faviconUrl: '',
    siteName: 'Elite Properties',
    siteTagline: 'Luxury Real Estate',
    siteTitle: 'Elite Properties - Real Estate Portfolio',
  })
  const [logoPreview, setLogoPreview] = useState(null)
  const [faviconPreview, setFaviconPreview] = useState(null)
  const logoInputRef = useRef(null)
  const faviconInputRef = useRef(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const [profileRes, settingsRes] = await Promise.all([
        fetch('/api/admin/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/site-settings', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ])

      if (profileRes.ok) {
        const profile = await profileRes.json()
        setAdminProfile({
          fullName: profile.fullName || '',
          email: profile.email || '',
          password: '',
          confirmPassword: '',
        })
      } else if (profileRes.status === 401) {
        localStorage.removeItem('token')
        router.push('/admin/login')
        return
      }

      if (settingsRes.ok) {
        const settings = await settingsRes.json()
        setSiteSettings({
          logoUrl: settings.logoUrl || '',
          faviconUrl: settings.faviconUrl || '',
          siteName: settings.siteName || 'Elite Properties',
          siteTagline: settings.siteTagline || 'Luxury Real Estate',
          siteTitle: settings.siteTitle || 'Elite Properties - Real Estate Portfolio',
        })
        if (settings.logoUrl) {
          setLogoPreview(settings.logoUrl)
        }
        if (settings.faviconUrl) {
          setFaviconPreview(settings.faviconUrl)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setAdminProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSettingsChange = (e) => {
    const { name, value } = e.target
    setSiteSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size cannot exceed 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result
      setLogoPreview(dataUrl)
      setSiteSettings(prev => ({ ...prev, logoUrl: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  const handleFaviconSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 1 * 1024 * 1024) {
      alert('Favicon size cannot exceed 1MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result
      setFaviconPreview(dataUrl)
      setSiteSettings(prev => ({ ...prev, faviconUrl: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    setSiteSettings(prev => ({ ...prev, logoUrl: null }))
    if (logoInputRef.current) {
      logoInputRef.current.value = ''
    }
  }

  const handleRemoveFavicon = () => {
    setFaviconPreview(null)
    setSiteSettings(prev => ({ ...prev, faviconUrl: null }))
    if (faviconInputRef.current) {
      faviconInputRef.current.value = ''
    }
  }

  const handleSaveProfile = async () => {
    try {
      if (adminProfile.password && adminProfile.password !== adminProfile.confirmPassword) {
        alert('Passwords do not match')
        return
      }

      if (adminProfile.password && adminProfile.password.length < 6) {
        alert('Password must be at least 6 characters')
        return
      }

      setSaving(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const payload = {
        fullName: adminProfile.fullName,
        email: adminProfile.email,
      }

      if (adminProfile.password) {
        payload.password = adminProfile.password
      }

      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        alert('Profile updated successfully!')
        setAdminProfile(prev => ({ ...prev, password: '', confirmPassword: '' }))
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/admin/login')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error saving profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch('/api/site-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(siteSettings),
      })

      if (response.ok) {
        alert('Site settings updated successfully! The logo and favicon will be updated on the frontend.')
        // Reload the page to see changes
        window.location.reload()
      } else if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/admin/login')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">My Page</h1>
          <p className="text-gray-400 text-sm">Manage your administrator settings.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">My Page</h1>
        <p className="text-gray-400 text-sm">Manage your administrator profile and site settings.</p>
      </div>

      {/* Admin Profile Section */}
      <div className="bg-dark-lighter rounded-xl p-6 border border-primary/20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          Administrator Profile
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={adminProfile.fullName}
                onChange={handleProfileChange}
                className="w-full pl-12 pr-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Admin User"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={adminProfile.email}
                onChange={handleProfileChange}
                className="w-full pl-12 pr-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="admin@eliteproperties.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              New Password (leave blank to keep current)
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={adminProfile.password}
                onChange={handleProfileChange}
                className="w-full pl-12 pr-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter new password"
              />
            </div>
          </div>

          {adminProfile.password && (
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={adminProfile.confirmPassword}
                  onChange={handleProfileChange}
                  className="w-full pl-12 pr-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Site Settings Section */}
      <div className="bg-dark-lighter rounded-xl p-6 border border-primary/20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-primary" />
          Site Settings
        </h2>

        <div className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Logo Image
            </label>
            <p className="text-xs text-gray-500 mb-3">This logo will be displayed in the navbar on the frontend.</p>
            {logoPreview ? (
              <div className="relative inline-block">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="max-w-xs max-h-32 object-contain rounded-lg border border-primary/20"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
                <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400 mb-3">No logo uploaded</p>
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2 mx-auto"
                >
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </button>
              </div>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoSelect}
              className="hidden"
            />
          </div>

          {/* Favicon Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Favicon Image
            </label>
            <p className="text-xs text-gray-500 mb-3">This icon will be displayed in the browser tab. Recommended size: 32x32 or 64x64 pixels.</p>
            {faviconPreview ? (
              <div className="relative inline-block">
                <img
                  src={faviconPreview}
                  alt="Favicon preview"
                  className="w-16 h-16 object-contain rounded-lg border border-primary/20"
                />
                <button
                  onClick={handleRemoveFavicon}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
                <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400 mb-3">No favicon uploaded</p>
                <button
                  onClick={() => faviconInputRef.current?.click()}
                  className="px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2 mx-auto"
                >
                  <Upload className="w-4 h-4" />
                  Upload Favicon
                </button>
              </div>
            )}
            <input
              ref={faviconInputRef}
              type="file"
              accept="image/*"
              onChange={handleFaviconSelect}
              className="hidden"
            />
          </div>

          {/* Site Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Site Name
            </label>
            <input
              type="text"
              name="siteName"
              value={siteSettings.siteName}
              onChange={handleSettingsChange}
              className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Elite Properties"
            />
          </div>

          {/* Site Tagline */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Site Tagline
            </label>
            <input
              type="text"
              name="siteTagline"
              value={siteSettings.siteTagline}
              onChange={handleSettingsChange}
              className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Luxury Real Estate"
            />
          </div>

          {/* Site Title */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Browser Tab Title
            </label>
            <p className="text-xs text-gray-500 mb-3">This title will be displayed in the browser tab next to the favicon.</p>
            <input
              type="text"
              name="siteTitle"
              value={siteSettings.siteTitle}
              onChange={handleSettingsChange}
              className="w-full px-4 py-3 bg-dark border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="Elite Properties - Real Estate Portfolio"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

