import { NextResponse } from 'next/server'
import { readTable, writeTable, generateId, getCurrentTimestamp } from '../../../lib/db'
import { verifyAuth } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/free-guide - Get all guides (admin only)
export async function GET(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const guides = readTable('freeGuides')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return NextResponse.json(guides)
  } catch (error) {
    console.error('Error fetching guides:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/free-guide - Create guide (admin only)
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
    const guides = readTable('freeGuides')

    const newGuide = {
      id: generateId(),
      title: body.title,
      description: body.description || null,
      fileUrl: body.fileUrl,
      fileName: body.fileName,
      fileSize: body.fileSize || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      downloadCount: 0,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    guides.push(newGuide)
    writeTable('freeGuides', guides)

    return NextResponse.json(newGuide, { status: 201 })
  } catch (error) {
    console.error('Error creating guide:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

