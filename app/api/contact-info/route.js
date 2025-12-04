import { NextResponse } from 'next/server'
import { readTable, writeTable, generateId, getCurrentTimestamp } from '../../../lib/db'
import { verifyAuth } from '../../../lib/auth'

// GET /api/contact-info - Get active contact info (public)
export async function GET(request) {
  try {
    const contactInfo = readTable('contactInfo')
    const activeContactInfo = contactInfo.find(ci => ci.isActive) || null

    return NextResponse.json(activeContactInfo)
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/contact-info - Create contact info (admin only)
export async function POST(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const contactInfo = readTable('contactInfo')

    // Only allow one contact info record - update existing if found
    const existing = contactInfo[0]
    if (existing) {
      const updatedContactInfo = {
        ...existing,
        ...body,
        updatedAt: getCurrentTimestamp(),
      }
      contactInfo[0] = updatedContactInfo
      writeTable('contactInfo', contactInfo)
      return NextResponse.json(updatedContactInfo)
    }

    const newContactInfo = {
      id: generateId(),
      phone: body.phone || null,
      phoneHours: body.phoneHours || null,
      email: body.email || null,
      emailSupport: body.emailSupport || null,
      office: body.office || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    contactInfo.push(newContactInfo)
    writeTable('contactInfo', contactInfo)

    return NextResponse.json(newContactInfo, { status: 201 })
  } catch (error) {
    console.error('Error creating contact info:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

