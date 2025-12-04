'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import TopBar from '../../src/components/admin/TopBar'
import Sidebar from '../../src/components/admin/Sidebar'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Prevent body scrolling on admin pages
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    // Check authentication for admin pages (except login)
    if (pathname === '/admin/login') {
      setIsChecking(false)
      setIsAuthenticated(false)
      return
    }

    // Check if token exists
    const token = localStorage.getItem('token')
    if (!token) {
      setIsAuthenticated(false)
      setIsChecking(false)
      router.push('/admin/login')
      return
    }

    // Verify token is valid (basic check)
    try {
      // Token exists, consider authenticated
      setIsAuthenticated(true)
      setIsChecking(false)
    } catch (error) {
      // Invalid token
      localStorage.removeItem('token')
      setIsAuthenticated(false)
      setIsChecking(false)
      router.push('/admin/login')
    }
  }, [pathname, router])

  // Show loading state while checking
  if (isChecking && pathname !== '/admin/login') {
    return (
      <div className="h-screen bg-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Don't show layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Don't render admin layout if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="h-screen bg-dark overflow-hidden flex flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden mt-16">
        <Sidebar />
        <main className="flex-1 ml-64 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}

