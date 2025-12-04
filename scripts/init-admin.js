// Script to initialize admin user
// Run with: node scripts/init-admin.js

const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

// Database utilities
const DB_PATH = path.join(process.cwd(), 'data', 'database.json')

function readDatabase() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData = {
        admins: [],
        agents: [],
        journeys: [],
        investors: [],
        reviews: [],
        contactInfo: [],
        contactMessages: [],
        galleryItems: [],
        properties: [],
        propertyAppraisalBookings: [],
        freeGuides: [],
        guideDownloads: [],
        buyers: [],
        buyerEnquiries: [],
      }
      const dataDir = path.dirname(DB_PATH)
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8')
      return initialData
    }
    const data = fs.readFileSync(DB_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading database:', error)
    throw error
  }
}

function writeDatabase(data) {
  try {
    const dataDir = path.dirname(DB_PATH)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error('Error writing database:', error)
    throw error
  }
}

async function initAdmin() {
  try {
    const db = readDatabase()
    
    // Check if admin already exists
    const existingAdmin = db.admins.find(a => a.email === 'admin@eliteproperties.com')
    
    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create default admin
    const passwordHash = await bcrypt.hash('admin123', 10)
    const admin = {
      id: uuidv4(),
      email: 'admin@eliteproperties.com',
      passwordHash: passwordHash,
      fullName: 'Admin User',
      role: 'admin',
      isActive: true,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    db.admins.push(admin)
    writeDatabase(db)

    console.log('Admin user created successfully!')
    console.log('Email: admin@eliteproperties.com')
    console.log('Password: admin123')
    console.log('Please change the password after first login!')
  } catch (error) {
    console.error('Error initializing admin:', error)
    process.exit(1)
  }
}

initAdmin()

