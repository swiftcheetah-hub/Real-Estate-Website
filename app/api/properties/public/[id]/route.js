import { NextResponse } from 'next/server'
import { readTable } from '../../../../../lib/db'

export const dynamic = 'force-dynamic'

// GET /api/properties/public/[id] - Get single property (public)
export async function GET(request, { params }) {
  try {
    const { id } = params
    const properties = readTable('properties')
    const property = properties.find(p => p.id === id && p.isActive)

    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

