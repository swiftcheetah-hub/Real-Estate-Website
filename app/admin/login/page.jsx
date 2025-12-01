'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.access_token)
        router.push('/admin')
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Invalid credentials' }))
        setError(errorData.message || 'Invalid email or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Failed to connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-lighter rounded-xl border border-primary/20 p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-10 h-10 text-black" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white text-center mb-2">Admin Login</h1>
          <p className="text-gray-400 text-center mb-8">Sign in to access the admin panel</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="admin@eliteproperties.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-dark border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Default Credentials Info */}
          <div className="mt-6 p-4 bg-dark border border-primary/10 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              Default credentials:
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              Email: admin@eliteproperties.com
            </p>
            <p className="text-xs text-gray-500 text-center">
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

