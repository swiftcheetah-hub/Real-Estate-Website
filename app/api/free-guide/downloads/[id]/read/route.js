import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../../../lib/db'
import { verifyAuth } from '../../../../../../lib/auth'

// PATCH /api/free-guide/downloads/[id]/read - Mark download as read (admin only)
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
    const downloads = readTable('guideDownloads')
    const downloadIndex = downloads.findIndex(d => d.id === id)

    if (downloadIndex === -1) {
      return NextResponse.json(
        { message: 'Download not found' },
        { status: 404 }
      )
    }

    const updatedDownload = {
      ...downloads[downloadIndex],
      isRead: true,
      updatedAt: getCurrentTimestamp(),
    }

    downloads[downloadIndex] = updatedDownload
    writeTable('guideDownloads', downloads)

    return NextResponse.json(updatedDownload)
  } catch (error) {
    console.error('Error marking download as read:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

