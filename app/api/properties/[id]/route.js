import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

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
    const properties = readTable('properties')
    const propertyIndex = properties.findIndex(p => p.id === id)

    if (propertyIndex === -1) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      )
    }

    const existingProperty = properties[propertyIndex]
    
    // Parse FormData
    const formData = await request.formData()
    const body = {}
    
    // Extract all form fields (except files)
    for (const [key, value] of formData.entries()) {
      if (key !== 'images' && key !== 'existingImages') {
        body[key] = value
      }
    }

    // Handle existing images
    let existingImages = existingProperty.images || []
    const existingImagesStr = formData.get('existingImages')
    if (existingImagesStr) {
      try {
        existingImages = JSON.parse(existingImagesStr)
      } catch (e) {
        console.error('Error parsing existingImages:', e)
      }
    }

    // Process new image files - convert to base64
    const newImages = []
    const imageFiles = formData.getAll('images')
    for (const file of imageFiles) {
      if (file instanceof File) {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const base64 = buffer.toString('base64')
          const dataUrl = `data:${file.type};base64,${base64}`
          newImages.push(dataUrl)
        } catch (e) {
          console.error('Error processing image file:', e)
        }
      }
    }

    // Combine existing and new images
    const allImages = [...existingImages, ...newImages]

    // Parse features from comma-separated string
    let features = existingProperty.features || []
    if (body.features) {
      features = body.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0)
    }

    const updatedProperty = {
      ...existingProperty,
      title: body.title !== undefined ? body.title : existingProperty.title,
      address: body.address !== undefined ? (body.address || null) : existingProperty.address,
      price: body.price !== undefined ? parseFloat(body.price) || 0 : existingProperty.price,
      bedrooms: body.bedrooms !== undefined ? parseInt(body.bedrooms) || 0 : existingProperty.bedrooms,
      bathrooms: body.bathrooms !== undefined ? parseInt(body.bathrooms) || 0 : existingProperty.bathrooms,
      area: body.area !== undefined ? (body.area ? parseInt(body.area) : null) : existingProperty.area,
      areaUnit: body.areaUnit !== undefined ? (body.areaUnit || null) : existingProperty.areaUnit,
      floor: body.floor !== undefined ? (body.floor ? parseInt(body.floor) : null) : existingProperty.floor,
      landSize: body.landSize !== undefined ? (body.landSize || null) : existingProperty.landSize,
      yearBuilt: body.yearBuilt !== undefined ? (body.yearBuilt ? parseInt(body.yearBuilt) : null) : existingProperty.yearBuilt,
      type: body.type !== undefined ? (body.type || null) : existingProperty.type,
      status: body.status !== undefined ? (body.status || null) : existingProperty.status,
      description: body.description !== undefined ? (body.description || null) : existingProperty.description,
      images: allImages,
      features: features,
      agentId: body.agentId !== undefined ? (body.agentId || null) : existingProperty.agentId,
      isActive: body.isActive !== undefined ? (body.isActive === 'true' || body.isActive === true || body.isActive === 'on') : existingProperty.isActive,
      isFeatured: body.isFeatured !== undefined ? (body.isFeatured === 'true' || body.isFeatured === true || body.isFeatured === 'on') : existingProperty.isFeatured,
      displayOrder: body.displayOrder !== undefined ? parseInt(body.displayOrder) || 0 : existingProperty.displayOrder,
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

