'use client'

import { useEffect } from 'react'

export default function FaviconHandler() {
  useEffect(() => {
    // Fetch site settings and update favicon and title
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => {
        // Update favicon
        if (data.faviconUrl) {
          // Remove existing favicon links
          const existingLinks = document.querySelectorAll("link[rel*='icon']")
          existingLinks.forEach(link => link.remove())

          // Add new favicon
          const link = document.createElement('link')
          link.rel = 'icon'
          link.type = 'image/png'
          link.href = data.faviconUrl
          document.head.appendChild(link)
        }

        // Update document title
        if (data.siteTitle) {
          document.title = data.siteTitle
        }
      })
      .catch(err => console.error('Error fetching site settings:', err))
  }, [])

  return null
}

