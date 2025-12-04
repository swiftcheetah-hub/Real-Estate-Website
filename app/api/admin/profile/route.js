import { NextResponse } from 'next/server'
import { readTable, writeTable, getCurrentTimestamp } from '@/lib/db'
import { verifyAuth, hashPassword } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/admin/profile - Get current admin profile (admin only)
export async function GET(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const admins = readTable('admins')
    const admin = admins.find(a => a.id === auth.user.sub || a.id === auth.user.id)

    if (!admin) {
      return NextResponse.json(
        { message: 'Admin not found' },
        { status: 404 }
      )
    }

    // Don't return password hash
    const { passwordHash, ...adminProfile } = admin
    return NextResponse.json(adminProfile)
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/profile - Update admin profile (admin only)
export async function PATCH(request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.valid) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const admins = readTable('admins')
    const userId = auth.user.sub || auth.user.id
    const adminIndex = admins.findIndex(a => a.id === userId)

    if (adminIndex === -1) {
      return NextResponse.json(
        { message: 'Admin not found' },
        { status: 404 }
      )
    }

    const updatedAdmin = {
      ...admins[adminIndex],
      updatedAt: getCurrentTimestamp(),
    }

    // Update fullName if provided
    if (body.fullName !== undefined) {
      updatedAdmin.fullName = body.fullName
    }

    // Update email if provided
    if (body.email !== undefined) {
      // Check if email is already taken by another admin
      const userId = auth.user.sub || auth.user.id
      const emailExists = admins.some(a => a.id !== userId && a.email === body.email)
      if (emailExists) {
        return NextResponse.json(
          { message: 'Email already in use' },
          { status: 400 }
        )
      }
      updatedAdmin.email = body.email
    }

    // Update password if provided
    if (body.password !== undefined && body.password.trim() !== '') {
      if (body.password.length < 6) {
        return NextResponse.json(
          { message: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }
      updatedAdmin.passwordHash = await hashPassword(body.password)
    }

    admins[adminIndex] = updatedAdmin
    writeTable('admins', admins)

    // Don't return password hash
    const { passwordHash, ...adminProfile } = updatedAdmin
    return NextResponse.json(adminProfile)
  } catch (error) {
    console.error('Error updating admin profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

