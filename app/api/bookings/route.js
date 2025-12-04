import { NextResponse } from 'next/server'
import { readTable, writeTable, generateId, getCurrentTimestamp } from '../../../lib/db'
import { verifyAuth } from '../../../lib/auth'

// POST /api/bookings - Create booking (public)
export async function POST(request) {
  try {
    const body = await request.json()
    const bookings = readTable('propertyAppraisalBookings')

    const newBooking = {
      id: generateId(),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || null,
      propertyAddress: body.propertyAddress || null,
      propertyType: body.propertyType || null,
      notes: body.notes || null,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      agentId: body.agentId || null,
      agentPreference: body.agentPreference || null,
      isRead: false,
      status: body.status || 'pending',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    bookings.push(newBooking)
    writeTable('propertyAppraisalBookings', bookings)

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/bookings - Get all bookings (admin only)
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
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

