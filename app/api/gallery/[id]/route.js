import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/gallery/[id] - Get gallery item by ID (admin only)
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
    const galleryItems = readTable('galleryItems')
    const galleryItem = galleryItems.find(item => item.id === id)

    if (!galleryItem) {
      return NextResponse.json(
        { message: 'Gallery item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(galleryItem)
  } catch (error) {
    console.error('Error fetching gallery item:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/gallery/[id] - Update gallery item (admin only)
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
    const galleryItems = readTable('galleryItems')
    const galleryItemIndex = galleryItems.findIndex(item => item.id === id)

    if (galleryItemIndex === -1) {
      return NextResponse.json(
        { message: 'Gallery item not found' },
        { status: 404 }
      )
    }

    const updatedGalleryItem = {
      ...galleryItems[galleryItemIndex],
      ...body,
      updatedAt: getCurrentTimestamp(),
    }

    galleryItems[galleryItemIndex] = updatedGalleryItem
    writeTable('galleryItems', galleryItems)

    return NextResponse.json(updatedGalleryItem)
  } catch (error) {
    console.error('Error updating gallery item:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/gallery/[id] - Delete gallery item (admin only)
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
    const galleryItems = readTable('galleryItems')
    const galleryItemIndex = galleryItems.findIndex(item => item.id === id)

    if (galleryItemIndex === -1) {
      return NextResponse.json(
        { message: 'Gallery item not found' },
        { status: 404 }
      )
    }

    galleryItems.splice(galleryItemIndex, 1)
    writeTable('galleryItems', galleryItems)

    return NextResponse.json({ message: 'Gallery item deleted successfully' })
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

