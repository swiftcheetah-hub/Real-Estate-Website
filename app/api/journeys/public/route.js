import { NextResponse } from 'next/server'
import { readTable } from '../../../../lib/db'

// GET /api/journeys/public - Get all active journeys (public)
export async function GET(request) {
  try {
    const journeys = readTable('journeys')
      .filter(j => j.isActive)
      .sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder
        }
        return new Date(b.createdAt) - new Date(a.createdAt)
      })

    return NextResponse.json(journeys)
  } catch (error) {
    console.error('Error fetching public journeys:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

