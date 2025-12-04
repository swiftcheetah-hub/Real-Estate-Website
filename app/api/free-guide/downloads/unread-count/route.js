import { NextResponse } from 'next/server'
import { readTable } from '../../../../../lib/db'
import { verifyAuth } from '../../../../../lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/free-guide/downloads/unread-count - Get unread downloads count (admin only)
export async function GET(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const downloads = readTable('guideDownloads')
    const count = downloads.filter(d => !d.isRead).length

    return NextResponse.json(count)
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

