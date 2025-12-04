import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/buyers/[id] - Get a single buyer (admin only)
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
    const buyers = readTable('buyers')
    const buyer = buyers.find(b => b.id === id)

    if (!buyer) {
      return NextResponse.json(
        { message: 'Buyer not found' },
        { status: 404 }
      )
    }

    const enquiries = readTable('buyerEnquiries')
      .filter(e => e.buyerId === buyer.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return NextResponse.json({ ...buyer, enquiries })
  } catch (error) {
    console.error('Error fetching buyer:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/buyers/[id] - Update a buyer (admin only)
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
    const buyers = readTable('buyers')
    const buyerIndex = buyers.findIndex(b => b.id === id)

    if (buyerIndex === -1) {
      return NextResponse.json(
        { message: 'Buyer not found' },
        { status: 404 }
      )
    }

    const updatedBuyer = {
      ...buyers[buyerIndex],
      ...body,
      updatedAt: getCurrentTimestamp(),
    }

    buyers[buyerIndex] = updatedBuyer
    writeTable('buyers', buyers)

    return NextResponse.json(updatedBuyer)
  } catch (error) {
    console.error('Error updating buyer:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/buyers/[id] - Delete a buyer (admin only)
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
    const buyers = readTable('buyers')
    const buyerIndex = buyers.findIndex(b => b.id === id)

    if (buyerIndex === -1) {
      return NextResponse.json(
        { message: 'Buyer not found' },
        { status: 404 }
      )
    }

    // Also delete related enquiries
    const enquiries = readTable('buyerEnquiries')
    const filteredEnquiries = enquiries.filter(e => e.buyerId !== id)
    writeTable('buyerEnquiries', filteredEnquiries)
    
    buyers.splice(buyerIndex, 1)
    writeTable('buyers', buyers)

    return NextResponse.json({ message: 'Buyer deleted successfully' })
  } catch (error) {
    console.error('Error deleting buyer:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

