import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../../lib/db'
import { verifyAuth } from '../../../../../lib/auth'

// PATCH /api/messages/[id]/read - Mark message as read (admin only)
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
    const messages = readTable('contactMessages')
    const messageIndex = messages.findIndex(m => m.id === id)

    if (messageIndex === -1) {
      return NextResponse.json(
        { message: 'Message not found' },
        { status: 404 }
      )
    }

    const updatedMessage = {
      ...messages[messageIndex],
      isRead: true,
      updatedAt: getCurrentTimestamp(),
    }

    messages[messageIndex] = updatedMessage
    writeTable('contactMessages', messages)

    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.error('Error marking message as read:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

