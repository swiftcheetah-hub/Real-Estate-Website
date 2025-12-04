import { NextResponse } from 'next/server'
import { readTable, writeTable, generateId, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

// POST /api/free-guide/downloads - Create download record (public)
export async function POST(request) {
  try {
    const body = await request.json()
    const guides = readTable('freeGuides')
    const downloads = readTable('guideDownloads')

    // Verify guide exists
    const guide = guides.find(g => g.id === body.guideId)
    if (!guide) {
      return NextResponse.json(
        { message: 'Guide not found' },
        { status: 404 }
      )
    }

    const newDownload = {
      id: generateId(),
      guideId: body.guideId,
      fullName: body.fullName,
      email: body.email,
      isRead: false,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    downloads.push(newDownload)
    writeTable('guideDownloads', downloads)

    // Increment download count
    const guideIndex = guides.findIndex(g => g.id === body.guideId)
    if (guideIndex !== -1) {
      guides[guideIndex].downloadCount = (guides[guideIndex].downloadCount || 0) + 1
      writeTable('freeGuides', guides)
    }

    return NextResponse.json(newDownload, { status: 201 })
  } catch (error) {
    console.error('Error creating download:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/free-guide/downloads - Get all downloads (admin only)
export async function GET(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const downloads = readTable('guideDownloads')
    const guides = readTable('freeGuides')
    const downloadsWithGuides = downloads
      .map(download => {
        const guide = guides.find(g => g.id === download.guideId)
        return { ...download, guide }
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return NextResponse.json(downloadsWithGuides)
  } catch (error) {
    console.error('Error fetching downloads:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

