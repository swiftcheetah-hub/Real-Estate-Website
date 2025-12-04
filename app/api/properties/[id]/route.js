import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

// GET /api/properties/[id] - Get property by ID (admin only)
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
    const properties = readTable('properties')
    const property = properties.find(p => p.id === id)

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

// PATCH /api/properties/[id] - Update property (admin only)
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
    const properties = readTable('properties')
    const propertyIndex = properties.findIndex(p => p.id === id)

    if (propertyIndex === -1) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      )
    }

    const existingProperty = properties[propertyIndex]
    const updatedProperty = {
      ...existingProperty,
      ...body,
      price: body.price !== undefined ? parseFloat(body.price) : existingProperty.price,
      bedrooms: body.bedrooms !== undefined ? parseInt(body.bedrooms) : existingProperty.bedrooms,
      bathrooms: body.bathrooms !== undefined ? parseInt(body.bathrooms) : existingProperty.bathrooms,
      area: body.area !== undefined ? (body.area ? parseInt(body.area) : null) : existingProperty.area,
      floor: body.floor !== undefined ? (body.floor ? parseInt(body.floor) : null) : existingProperty.floor,
      yearBuilt: body.yearBuilt !== undefined ? (body.yearBuilt ? parseInt(body.yearBuilt) : null) : existingProperty.yearBuilt,
      images: body.images !== undefined ? (Array.isArray(body.images) ? body.images : existingProperty.images) : existingProperty.images,
      features: body.features !== undefined ? (Array.isArray(body.features) ? body.features : existingProperty.features) : existingProperty.features,
      updatedAt: getCurrentTimestamp(),
    }

    properties[propertyIndex] = updatedProperty
    writeTable('properties', properties)

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/properties/[id] - Delete property (admin only)
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
    const properties = readTable('properties')
    const propertyIndex = properties.findIndex(p => p.id === id)

    if (propertyIndex === -1) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      )
    }

    properties.splice(propertyIndex, 1)
    writeTable('properties', properties)

    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

