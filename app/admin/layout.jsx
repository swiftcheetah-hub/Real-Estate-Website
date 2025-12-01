'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import TopBar from '../../src/components/admin/TopBar'
import Sidebar from '../../src/components/admin/Sidebar'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Prevent body scrolling on admin pages
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    // Check authentication for admin pages (except login)
    if (pathname !== '/admin/login') {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
      }
    }
  }, [pathname, router])

  // Don't show layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>
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

