import { NextResponse } from 'next/server'
import { readTable, writeTable, generateId, getCurrentTimestamp } from '../../../lib/db'
import { verifyAuth } from '../../../lib/auth'

// POST /api/messages - Create message (public)
export async function POST(request) {
  try {
    const body = await request.json()
    const messages = readTable('contactMessages')
    const agents = readTable('agents')

    const newMessage = {
      id: generateId(),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || null,
      agentId: body.agentId || null,
      message: body.message,
      isRead: false,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    messages.push(newMessage)
    writeTable('contactMessages', messages)

    // Get agent name if agentId exists
    let agentName = null
    if (newMessage.agentId) {
      const agent = agents.find(a => a.id === newMessage.agentId)
      agentName = agent?.name || null
    }

    return NextResponse.json({ ...newMessage, agentName }, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/messages - Get all messages (admin only)
export async function GET(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const messages = readTable('contactMessages')
    const agents = readTable('agents')
    const messagesWithAgentNames = messages
      .map(message => {
        let agentName = null
        if (message.agentId) {
          const agent = agents.find(a => a.id === message.agentId)
          agentName = agent?.name || null
        }
        return { ...message, agentName }
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return NextResponse.json(messagesWithAgentNames)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

