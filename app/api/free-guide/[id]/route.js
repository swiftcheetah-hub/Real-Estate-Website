import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/free-guide/[id] - Get guide by ID (admin only)
export async function GET(request, { params }) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const guides = readTable('freeGuides')
    const guide = guides.find(g => g.id === id)

    if (!guide) {
      return NextResponse.json(
        { message: 'Guide not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(guide)
  } catch (error) {
    console.error('Error fetching guide:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/free-guide/[id] - Update guide (admin only)
export async function PATCH(request, { params }) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const guides = readTable('freeGuides')
    const guideIndex = guides.findIndex(g => g.id === id)

    if (guideIndex === -1) {
      return NextResponse.json(
        { message: 'Guide not found' },
        { status: 404 }
      )
    }

    const updatedGuide = {
      ...guides[guideIndex],
      ...body,
      updatedAt: getCurrentTimestamp(),
    }

    guides[guideIndex] = updatedGuide
    writeTable('freeGuides', guides)

    return NextResponse.json(updatedGuide)
  } catch (error) {
    console.error('Error updating guide:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/free-guide/[id] - Delete guide (admin only)
export async function DELETE(request, { params }) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const guides = readTable('freeGuides')
    const guideIndex = guides.findIndex(g => g.id === id)

    if (guideIndex === -1) {
      return NextResponse.json(
        { message: 'Guide not found' },
        { status: 404 }
      )
    }

    // Also delete related downloads
    const downloads = readTable('guideDownloads')
    const filteredDownloads = downloads.filter(d => d.guideId !== id)
    writeTable('guideDownloads', filteredDownloads)
    
    guides.splice(guideIndex, 1)
    writeTable('freeGuides', guides)

    return NextResponse.json({ message: 'Guide deleted successfully' })
  } catch (error) {
    console.error('Error deleting guide:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

