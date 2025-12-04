import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../../lib/db'
import { verifyAuth } from '../../../../../lib/auth'

// PATCH /api/bookings/[id]/read - Mark booking as read (admin only)
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
    const bookings = readTable('propertyAppraisalBookings')
    const bookingIndex = bookings.findIndex(b => b.id === id)

    if (bookingIndex === -1) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      )
    }

    const updatedBooking = {
      ...bookings[bookingIndex],
      isRead: true,
      updatedAt: getCurrentTimestamp(),
    }

    bookings[bookingIndex] = updatedBooking
    writeTable('propertyAppraisalBookings', bookings)

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error marking booking as read:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

