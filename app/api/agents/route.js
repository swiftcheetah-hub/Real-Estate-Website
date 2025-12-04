import { NextResponse } from 'next/server'
import { readTable, writeTable, generateId, getCurrentTimestamp } from '../../../lib/db'
import { verifyAuth } from '../../../lib/auth'

// GET /api/agents - Get all agents (admin only)
export async function GET(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const agents = readTable('agents')
      .filter(agent => agent.isActive !== false)
      .sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder
        }
        return new Date(b.createdAt) - new Date(a.createdAt)
      })

    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/agents - Create agent (admin only)
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
    const agents = readTable('agents')

    const newAgent = {
      id: generateId(),
      name: body.name,
      role: body.role || null,
      email: body.email || null,
      phone: body.phone || null,
      imageUrl: body.imageUrl || null,
      description: body.description || null,
      education: body.education || null,
      specialties: Array.isArray(body.specialties) ? body.specialties : [],
      certifications: Array.isArray(body.certifications) ? body.certifications : [],
      achievements: Array.isArray(body.achievements) ? body.achievements : [],
      isActive: body.isActive !== undefined ? body.isActive : true,
      displayOrder: body.displayOrder || 0,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }

    agents.push(newAgent)
    writeTable('agents', agents)

    return NextResponse.json(newAgent, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

