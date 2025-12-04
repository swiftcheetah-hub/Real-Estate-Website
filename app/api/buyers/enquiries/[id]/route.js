import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../../lib/db'
import { verifyAuth } from '../../../../../lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/buyers/enquiries/[id] - Get a single enquiry (admin only)
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
    const enquiries = readTable('buyerEnquiries')
    const enquiry = enquiries.find(e => e.id === id)

    if (!enquiry) {
      return NextResponse.json(
        { message: 'Enquiry not found' },
        { status: 404 }
      )
    }

    const buyers = readTable('buyers')
    const buyer = buyers.find(b => b.id === enquiry.buyerId)
    return NextResponse.json({ ...enquiry, buyer })
  } catch (error) {
    console.error('Error fetching enquiry:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/buyers/enquiries/[id] - Delete an enquiry (admin only)
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
    const enquiries = readTable('buyerEnquiries')
    const enquiryIndex = enquiries.findIndex(e => e.id === id)

    if (enquiryIndex === -1) {
      return NextResponse.json(
        { message: 'Enquiry not found' },
        { status: 404 }
      )
    }

    enquiries.splice(enquiryIndex, 1)
    writeTable('buyerEnquiries', enquiries)

    return NextResponse.json({ message: 'Enquiry deleted successfully' })
  } catch (error) {
    console.error('Error deleting enquiry:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

