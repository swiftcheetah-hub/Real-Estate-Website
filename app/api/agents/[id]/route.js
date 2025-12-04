import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { verifyAuth } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/agents/[id] - Get agent by ID (admin only)
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
    const agents = readTable('agents')
    const agent = agents.find(a => a.id === id)

    if (!agent) {
      return NextResponse.json(
        { message: 'Agent not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(agent)
  } catch (error) {
    console.error('Error fetching agent:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/agents/[id] - Update agent (admin only)
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
    const agents = readTable('agents')
    const agentIndex = agents.findIndex(a => a.id === id)

    if (agentIndex === -1) {
      return NextResponse.json(
        { message: 'Agent not found' },
        { status: 404 }
      )
    }

    const updatedAgent = {
      ...agents[agentIndex],
      ...body,
      specialties: body.specialties !== undefined ? (Array.isArray(body.specialties) ? body.specialties : agents[agentIndex].specialties) : agents[agentIndex].specialties,
      certifications: body.certifications !== undefined ? (Array.isArray(body.certifications) ? body.certifications : agents[agentIndex].certifications) : agents[agentIndex].certifications,
      achievements: body.achievements !== undefined ? (Array.isArray(body.achievements) ? body.achievements : agents[agentIndex].achievements) : agents[agentIndex].achievements,
      updatedAt: getCurrentTimestamp(),
    }

    agents[agentIndex] = updatedAgent
    writeTable('agents', agents)

    return NextResponse.json(updatedAgent)
  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/agents/[id] - Delete agent (admin only)
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
    const agents = readTable('agents')
    const agentIndex = agents.findIndex(a => a.id === id)

    if (agentIndex === -1) {
      return NextResponse.json(
        { message: 'Agent not found' },
        { status: 404 }
      )
    }

    agents.splice(agentIndex, 1)
    writeTable('agents', agents)

    return NextResponse.json({ message: 'Agent deleted successfully' })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

