import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../../lib/db'
import { verifyAuth } from '../../../../../lib/auth'

// PATCH /api/buyers/enquiries/read-all - Mark all enquiries as read (admin only)
export async function PATCH(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const enquiries = readTable('buyerEnquiries')
    const timestamp = getCurrentTimestamp()

    const updatedEnquiries = enquiries.map(enquiry => ({
      ...enquiry,
      isRead: true,
      updatedAt: timestamp,
    }))

    writeTable('buyerEnquiries', updatedEnquiries)

    return NextResponse.json({ message: 'All enquiries marked as read' })
  } catch (error) {
    console.error('Error marking all enquiries as read:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

