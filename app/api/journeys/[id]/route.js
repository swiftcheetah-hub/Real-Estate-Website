import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

// GET /api/journeys/[id] - Get journey by ID (admin only)
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
    const journeys = readTable('journeys')
    const journey = journeys.find(j => j.id === id)

    if (!journey) {
      return NextResponse.json(
        { message: 'Journey not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(journey)
  } catch (error) {
    console.error('Error fetching journey:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/journeys/[id] - Update journey (admin only)
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
    const journeys = readTable('journeys')
    const journeyIndex = journeys.findIndex(j => j.id === id)

    if (journeyIndex === -1) {
      return NextResponse.json(
        { message: 'Journey not found' },
        { status: 404 }
      )
    }

    const updatedJourney = {
      ...journeys[journeyIndex],
      ...body,
      updatedAt: getCurrentTimestamp(),
    }

    journeys[journeyIndex] = updatedJourney
    writeTable('journeys', journeys)

    return NextResponse.json(updatedJourney)
  } catch (error) {
    console.error('Error updating journey:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/journeys/[id] - Delete journey (admin only)
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
    const journeys = readTable('journeys')
    const journeyIndex = journeys.findIndex(j => j.id === id)

    if (journeyIndex === -1) {
      return NextResponse.json(
        { message: 'Journey not found' },
        { status: 404 }
      )
    }

    journeys.splice(journeyIndex, 1)
    writeTable('journeys', journeys)

    return NextResponse.json({ message: 'Journey deleted successfully' })
  } catch (error) {
    console.error('Error deleting journey:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

