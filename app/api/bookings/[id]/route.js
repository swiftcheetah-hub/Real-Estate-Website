import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

// GET /api/bookings/[id] - Get booking by ID (admin only)
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
    const bookings = readTable('propertyAppraisalBookings')
    const booking = bookings.find(b => b.id === id)

    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/bookings/[id] - Update booking (admin only)
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
      ...body,
      appointmentDate: body.appointmentDate || bookings[bookingIndex].appointmentDate,
      updatedAt: getCurrentTimestamp(),
    }

    bookings[bookingIndex] = updatedBooking
    writeTable('propertyAppraisalBookings', bookings)

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings/[id] - Delete booking (admin only)
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
    const bookings = readTable('propertyAppraisalBookings')
    const bookingIndex = bookings.findIndex(b => b.id === id)

    if (bookingIndex === -1) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      )
    }

    bookings.splice(bookingIndex, 1)
    writeTable('propertyAppraisalBookings', bookings)

    return NextResponse.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

