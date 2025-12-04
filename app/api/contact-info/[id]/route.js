import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

// PATCH /api/contact-info/[id] - Update contact info (admin only)
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
    const contactInfo = readTable('contactInfo')
    const contactInfoIndex = contactInfo.findIndex(ci => ci.id === id)

    if (contactInfoIndex === -1) {
      return NextResponse.json(
        { message: 'Contact info not found' },
        { status: 404 }
      )
    }

    const updatedContactInfo = {
      ...contactInfo[contactInfoIndex],
      ...body,
      updatedAt: getCurrentTimestamp(),
    }

    contactInfo[contactInfoIndex] = updatedContactInfo
    writeTable('contactInfo', contactInfo)

    return NextResponse.json(updatedContactInfo)
  } catch (error) {
    console.error('Error updating contact info:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/contact-info/[id] - Delete contact info (admin only)
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
    const contactInfo = readTable('contactInfo')
    const contactInfoIndex = contactInfo.findIndex(ci => ci.id === id)

    if (contactInfoIndex === -1) {
      return NextResponse.json(
        { message: 'Contact info not found' },
        { status: 404 }
      )
    }

    contactInfo.splice(contactInfoIndex, 1)
    writeTable('contactInfo', contactInfo)

    return NextResponse.json({ message: 'Contact info deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact info:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

