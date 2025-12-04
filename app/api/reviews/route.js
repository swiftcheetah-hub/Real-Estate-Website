import { NextResponse } from 'next/server'
import { readTable, writeTable, generateId, getCurrentTimestamp } from '../../../lib/db'
import { verifyAuth } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/reviews - Get all reviews (admin only)
export async function GET(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const reviews = readTable('reviews')
    const agents = readTable('agents')
    const reviewsWithAgentNames = reviews
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
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create review (admin only)
export async function POST(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const reviews = readTable('reviews')
    const agents = readTable('agents')

    const newReview = {
      id: generateId(),
      name: body.name,
      role: body.role || null,
      imageUrl: body.imageUrl || null,
      rating: parseInt(body.rating) || 5,
      text: body.text,
      property: body.property || null,
      agentId: body.agentId || null,
      displayOrder: body.displayOrder || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    reviews.push(newReview)
    writeTable('reviews', reviews)

    // Get agent name if agentId exists
    let agentName = null
    if (newReview.agentId) {
      const agent = agents.find(a => a.id === newReview.agentId)
      agentName = agent?.name || null
    }

    return NextResponse.json({ ...newReview, agentName }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

