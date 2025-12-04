import { NextResponse } from 'next/server'
import { readTable } from '../../../../lib/db'

export const dynamic = 'force-dynamic'

// GET /api/properties/public - Get all active properties (public)
export async function GET(request) {
  try {
    const properties = readTable('properties')
      .filter(p => p.isActive)
      .sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) {
          return b.isFeatured - a.isFeatured
        }
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder
        }
        return new Date(b.createdAt) - new Date(a.createdAt)
      })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching public properties:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

