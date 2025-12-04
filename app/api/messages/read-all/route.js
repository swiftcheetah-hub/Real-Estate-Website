import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

// PATCH /api/messages/read-all - Mark all messages as read (admin only)
export async function PATCH(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const messages = readTable('contactMessages')
    const timestamp = getCurrentTimestamp()

    const updatedMessages = messages.map(message => ({
      ...message,
      isRead: true,
      updatedAt: timestamp,
    }))

    writeTable('contactMessages', updatedMessages)

    return NextResponse.json({ message: 'All messages marked as read' })
  } catch (error) {
    console.error('Error marking all messages as read:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

