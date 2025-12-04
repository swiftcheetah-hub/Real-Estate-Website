import { NextResponse } from 'next/server'
import { readTable } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/bookings/unread-count - Get unread bookings count (admin only)
export async function GET(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bookings = readTable('propertyAppraisalBookings')
    const count = bookings.filter(b => !b.isRead).length

    return NextResponse.json(count)
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

