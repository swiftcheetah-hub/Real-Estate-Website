import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../lib/db'
import { verifyAuth } from '../../../lib/auth'

// Helper to get or create site settings
function getSiteSettings() {
  const settings = readTable('siteSettings')
  if (settings.length === 0) {
    // Create default settings
    const defaultSettings = {
      id: 'site-settings',
      logoUrl: null,
      faviconUrl: null,
      siteName: 'Elite Properties',
      siteTagline: 'Luxury Real Estate',
      siteTitle: 'Elite Properties - Real Estate Portfolio',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    writeTable('siteSettings', [defaultSettings])
    return defaultSettings
  }
  return settings[0]
}

// GET /api/site-settings - Get site settings (public)
export async function GET(request) {
  try {
    const settings = getSiteSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/site-settings - Update site settings (admin only)
export async function PATCH(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    let settings = readTable('siteSettings')
    
    let currentSettings
    if (settings.length === 0) {
      // Create default settings
      currentSettings = {
        id: 'site-settings',
        logoUrl: null,
        faviconUrl: null,
        siteName: 'Elite Properties',
        siteTagline: 'Luxury Real Estate',
        siteTitle: 'Elite Properties - Real Estate Portfolio',
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      }
    } else {
      currentSettings = settings[0]
    }

    const updatedSettings = {
      ...currentSettings,
      ...body,
      updatedAt: getCurrentTimestamp(),
    }

    writeTable('siteSettings', [updatedSettings])

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

