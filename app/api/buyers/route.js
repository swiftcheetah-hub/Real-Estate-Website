import { NextResponse } from 'next/server'
import { readTable, writeTable, generateId, getCurrentTimestamp } from '../../../lib/db'
import { verifyAuth } from '../../../lib/auth'

// GET /api/buyers - Get all active buyers (public)
export async function GET(request) {
  try {
    const buyers = readTable('buyers')
    const enquiries = readTable('buyerEnquiries')
    const buyersWithEnquiries = buyers
      .filter(b => b.isActive)
      .map(buyer => {
        const buyerEnquiries = enquiries
          .filter(e => e.buyerId === buyer.id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 1)
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

// POST /api/buyers - Create a new buyer (public)
export async function POST(request) {
  try {
    const body = await request.json()
    const buyers = readTable('buyers')

    const newBuyer = {
      id: generateId(),
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      buyerType: body.buyerType,
      budgetRange: body.budgetRange,
      bedrooms: body.bedrooms || null,
      bathrooms: body.bathrooms || null,
      garage: body.garage || null,
      preferredSuburbs: body.preferredSuburbs,
      landSize: body.landSize || null,
      additionalPreferences: body.additionalPreferences || null,
      preApproved: body.preApproved || false,
      isActive: true,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    buyers.push(newBuyer)
    writeTable('buyers', buyers)

    return NextResponse.json(newBuyer, { status: 201 })
  } catch (error) {
    console.error('Error creating buyer:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

