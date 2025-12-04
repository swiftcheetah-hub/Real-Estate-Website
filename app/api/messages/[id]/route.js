import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

// GET /api/messages/[id] - Get message by ID (admin only)
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
    const messages = readTable('contactMessages')
    const message = messages.find(m => m.id === id)

    if (!message) {
      return NextResponse.json(
        { message: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error fetching message:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/messages/[id] - Delete message (admin only)
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
    const messages = readTable('contactMessages')
    const messageIndex = messages.findIndex(m => m.id === id)

    if (messageIndex === -1) {
      return NextResponse.json(
        { message: 'Message not found' },
        { status: 404 }
      )
    }

    messages.splice(messageIndex, 1)
    writeTable('contactMessages', messages)

    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

