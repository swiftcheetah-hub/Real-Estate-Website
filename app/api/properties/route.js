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

    // Parse FormData
    const formData = await request.formData()
    const body = {}
    
    // Extract all form fields (except files)
    for (const [key, value] of formData.entries()) {
      if (key !== 'images' && key !== 'existingImages') {
        body[key] = value
      }
    }

    // Handle existing images (for new properties, this should be empty or undefined)
    let existingImages = []
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
    let features = []
    if (body.features) {
      features = body.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0)
    }

    const properties = readTable('properties')

    const newProperty = {
      id: generateId(),
      title: body.title || '',
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
      images: allImages,
      features: features,
      agentId: body.agentId || null,
      isActive: body.isActive !== undefined ? (body.isActive === 'true' || body.isActive === true || body.isActive === 'on') : true,
      isFeatured: body.isFeatured !== undefined ? (body.isFeatured === 'true' || body.isFeatured === true || body.isFeatured === 'on') : false,
      displayOrder: parseInt(body.displayOrder) || 0,
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

