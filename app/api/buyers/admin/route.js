import { NextResponse } from 'next/server'
import { readTable } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

// GET /api/buyers/admin - Get all buyers (admin only)
export async function GET(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const buyers = readTable('buyers')
    const enquiries = readTable('buyerEnquiries')
    const buyersWithEnquiries = buyers
      .map(buyer => {
        const buyerEnquiries = enquiries
          .filter(e => e.buyerId === buyer.id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        return { ...buyer, enquiries: buyerEnquiries }
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return NextResponse.json(buyersWithEnquiries)
  } catch (error) {
    console.error('Error fetching buyers:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

