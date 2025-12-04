import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '../../../../lib/db'
import { generateToken, comparePassword } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const admins = readTable('admins')
    const admin = admins.find(a => a.email === email)

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isPasswordValid = await comparePassword(password, admin.passwordHash)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login (optional - may fail on read-only filesystems like Vercel)
    try {
      admin.lastLogin = getCurrentTimestamp()
      const adminIndex = admins.findIndex(a => a.id === admin.id)
      admins[adminIndex] = admin
      writeTable('admins', admins)
    } catch (writeError) {
      // Ignore write errors - login can still proceed
      console.log('Could not update lastLogin (read-only filesystem)')
    }

    // Generate token
    const payload = { email: admin.email, sub: admin.id, role: admin.role }
    const access_token = generateToken(payload)

    return NextResponse.json({
      access_token,
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
