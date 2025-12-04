import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

// GET /api/investors/[id] - Get investor by ID (admin only)
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
    const investors = readTable('investors')
    const investor = investors.find(i => i.id === id)

    if (!investor) {
      return NextResponse.json(
        { message: 'Investor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(investor)
  } catch (error) {
    console.error('Error fetching investor:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/investors/[id] - Update investor (admin only)
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
    const investors = readTable('investors')
    const investorIndex = investors.findIndex(i => i.id === id)

    if (investorIndex === -1) {
      return NextResponse.json(
        { message: 'Investor not found' },
        { status: 404 }
      )
    }

    const updatedInvestor = {
      ...investors[investorIndex],
      ...body,
      updatedAt: getCurrentTimestamp(),
    }

    investors[investorIndex] = updatedInvestor
    writeTable('investors', investors)

    return NextResponse.json(updatedInvestor)
  } catch (error) {
    console.error('Error updating investor:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/investors/[id] - Delete investor (admin only)
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
    const investors = readTable('investors')
    const investorIndex = investors.findIndex(i => i.id === id)

    if (investorIndex === -1) {
      return NextResponse.json(
        { message: 'Investor not found' },
        { status: 404 }
      )
    }

    investors.splice(investorIndex, 1)
    writeTable('investors', investors)

    return NextResponse.json({ message: 'Investor deleted successfully' })
  } catch (error) {
    console.error('Error deleting investor:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

