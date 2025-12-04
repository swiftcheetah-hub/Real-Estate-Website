import { NextResponse } from 'next/server'
import { readTable, writeTable, generateId, getCurrentTimestamp } from '../../../../lib/db'

// POST /api/buyers/enquiries - Create a buyer enquiry (public)
export async function POST(request) {
  try {
    const body = await request.json()
    const buyers = readTable('buyers')
    const enquiries = readTable('buyerEnquiries')

    // Verify buyer exists
    const buyer = buyers.find(b => b.id === body.buyerId)
    if (!buyer) {
      return NextResponse.json(
        { message: 'Buyer not found' },
        { status: 404 }
      )
    }

    const newEnquiry = {
      id: generateId(),
      buyerId: body.buyerId,
      agentName: body.agentName,
      agentPhone: body.agentPhone,
      agentEmail: body.agentEmail,
      agencyOffice: body.agencyOffice,
      preferredSplit: body.preferredSplit,
      isRead: false,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    enquiries.push(newEnquiry)
    writeTable('buyerEnquiries', enquiries)

    return NextResponse.json(newEnquiry, { status: 201 })
  } catch (error) {
    console.error('Error creating enquiry:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

