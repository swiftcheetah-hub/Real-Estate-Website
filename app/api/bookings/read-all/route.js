import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

// PATCH /api/bookings/read-all - Mark all bookings as read (admin only)
export async function PATCH(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bookings = readTable('propertyAppraisalBookings')
    const timestamp = getCurrentTimestamp()

    const updatedBookings = bookings.map(booking => ({
      ...booking,
      isRead: true,
      updatedAt: timestamp,
    }))

    writeTable('propertyAppraisalBookings', updatedBookings)

    return NextResponse.json({ message: 'All bookings marked as read' })
  } catch (error) {
    console.error('Error marking all bookings as read:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

