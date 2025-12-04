import { NextResponse } from 'next/server'
import { readTable, writeTable, generateId, getCurrentTimestamp } from '../../../lib/db'
import { verifyAuth } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/properties - Get all properties (admin only)
export async function GET(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const properties = readTable('properties')
      .filter(p => p.isActive !== false)
      .sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder
        }
        return new Date(b.createdAt) - new Date(a.createdAt)
      })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/properties - Create property (admin only)
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
    const properties = readTable('properties')

    const newProperty = {
      id: generateId(),
      title: body.title,
      address: body.address || null,
      price: parseFloat(body.price) || 0,
      bedrooms: parseInt(body.bedrooms) || 0,
      bathrooms: parseInt(body.bathrooms) || 0,
      area: body.area ? parseInt(body.area) : null,
      areaUnit: body.areaUnit || null,
      floor: body.floor ? parseInt(body.floor) : null,
      landSize: body.landSize || null,
      yearBuilt: body.yearBuilt ? parseInt(body.yearBuilt) : null,
      type: body.type || null,
      status: body.status || null,
      description: body.description || null,
      images: Array.isArray(body.images) ? body.images : [],
      features: Array.isArray(body.features) ? body.features : [],
      agentId: body.agentId || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      isFeatured: body.isFeatured || false,
      displayOrder: body.displayOrder || 0,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    properties.push(newProperty)
    writeTable('properties', properties)

    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

