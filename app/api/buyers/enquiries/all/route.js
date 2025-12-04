import { NextResponse } from 'next/server'
import { readTable } from '../../../../../lib/db'
import { verifyAuth } from '../../../../../lib/auth'

// GET /api/buyers/enquiries/all - Get all enquiries (admin only)
export async function GET(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const enquiries = readTable('buyerEnquiries')
    const buyers = readTable('buyers')
    const enquiriesWithBuyers = enquiries
      .map(enquiry => {
        const buyer = buyers.find(b => b.id === enquiry.buyerId)
        return { ...enquiry, buyer }
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return NextResponse.json(enquiriesWithBuyers)
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

