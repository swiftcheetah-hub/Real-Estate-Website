import { NextResponse } from 'next/server'
import { readTable } from '../../../../lib/db'

// GET /api/gallery/public - Get all active gallery items (public)
export async function GET(request) {
  try {
    const galleryItems = readTable('galleryItems')
      .filter(item => item.isActive)
      .sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder
        }
        return new Date(b.createdAt) - new Date(a.createdAt)
      })

    return NextResponse.json(galleryItems)
  } catch (error) {
    console.error('Error fetching public gallery items:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

