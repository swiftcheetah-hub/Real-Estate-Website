import { NextResponse } from 'next/server'
import { readTable } from '../../../../lib/db'

export const dynamic = 'force-dynamic'

// GET /api/free-guide/active - Get active guide (public)
export async function GET(request) {
  try {
    const guides = readTable('freeGuides')
    const guide = guides
      .filter(g => g.isActive)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null

    return NextResponse.json(guide)
  } catch (error) {
    console.error('Error fetching active guide:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

