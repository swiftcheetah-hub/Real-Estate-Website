import { NextResponse } from 'next/server'
import { readTable } from '../../../../lib/db'

// GET /api/agents/public - Get all active agents (public)
export async function GET(request) {
  try {
    const agents = readTable('agents')
      .filter(a => a.isActive)
      .sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder
        }
        return new Date(b.createdAt) - new Date(a.createdAt)
      })

    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching public agents:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

