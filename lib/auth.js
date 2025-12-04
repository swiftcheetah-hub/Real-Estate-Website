import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

// Generate JWT token
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Hash password
export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

// Compare password
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

// Middleware to verify JWT token
export function verifyAuth(request) {
  const authHeader = request.headers.get('authorization')
  const token = extractTokenFromHeader(authHeader)
  
  if (!token) {
    return { valid: false, error: 'No token provided' }
  }
  
  const decoded = verifyToken(token)
  if (!decoded) {
    return { valid: false, error: 'Invalid token' }
  }
  
  return { valid: true, user: decoded }
}

