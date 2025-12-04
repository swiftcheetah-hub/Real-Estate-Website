import { NextResponse } from 'next/server'
import { readTable } from '../../../../lib/db'

export const dynamic = 'force-dynamic'

// GET /api/reviews/public - Get all active reviews (public)
export async function GET(request) {
  try {
    const reviews = readTable('reviews')
    const agents = readTable('agents')
    const reviewsWithAgentNames = reviews
      .filter(r => r.isActive)
      .map(review => {
        let agentName = null
        if (review.agentId) {
          const agent = agents.find(a => a.id === review.agentId)
          agentName = agent?.name || null
        }
        return { ...review, agentName }
      })
      .sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder
        }
        return new Date(b.createdAt) - new Date(a.createdAt)
      })

    return NextResponse.json(reviewsWithAgentNames)
  } catch (error) {
    console.error('Error fetching public reviews:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

