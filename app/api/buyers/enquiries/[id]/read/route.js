import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../../../lib/db'
import { verifyAuth } from '../../../../../../lib/auth'

// PATCH /api/buyers/enquiries/[id]/read - Mark enquiry as read (admin only)
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
    const enquiries = readTable('buyerEnquiries')
    const enquiryIndex = enquiries.findIndex(e => e.id === id)

    if (enquiryIndex === -1) {
      return NextResponse.json(
        { message: 'Enquiry not found' },
        { status: 404 }
      )
    }

    const updatedEnquiry = {
      ...enquiries[enquiryIndex],
      isRead: true,
      updatedAt: getCurrentTimestamp(),
    }

    enquiries[enquiryIndex] = updatedEnquiry
    writeTable('buyerEnquiries', enquiries)

    return NextResponse.json(updatedEnquiry)
  } catch (error) {
    console.error('Error marking enquiry as read:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

