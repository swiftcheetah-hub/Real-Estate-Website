import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

// GET /api/reviews/[id] - Get review by ID (admin only)
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
    const reviews = readTable('reviews')
    const review = reviews.find(r => r.id === id)

    if (!review) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/reviews/[id] - Update review (admin only)
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
    const reviews = readTable('reviews')
    const reviewIndex = reviews.findIndex(r => r.id === id)

    if (reviewIndex === -1) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 }
      )
    }

    const updatedReview = {
      ...reviews[reviewIndex],
      ...body,
      rating: body.rating !== undefined ? parseInt(body.rating) : reviews[reviewIndex].rating,
      updatedAt: getCurrentTimestamp(),
    }

    reviews[reviewIndex] = updatedReview
    writeTable('reviews', reviews)

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/reviews/[id] - Delete review (admin only)
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
    const reviews = readTable('reviews')
    const reviewIndex = reviews.findIndex(r => r.id === id)

    if (reviewIndex === -1) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 }
      )
    }

    reviews.splice(reviewIndex, 1)
    writeTable('reviews', reviews)

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

