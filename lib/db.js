import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const DATA_DIR = path.join(process.cwd(), 'data')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Table names mapping
const TABLES = {
  admins: 'admins.json',
  agents: 'agents.json',
  journeys: 'journeys.json',
  investors: 'investors.json',
  reviews: 'reviews.json',
  contactInfo: 'contact-info.json',
  contactMessages: 'contact-messages.json',
  galleryItems: 'gallery-items.json',
  properties: 'properties.json',
  propertyAppraisalBookings: 'bookings.json',
  freeGuides: 'free-guides.json',
  guideDownloads: 'guide-downloads.json',
  buyers: 'buyers.json',
  buyerEnquiries: 'buyer-enquiries.json',
  siteSettings: 'site-settings.json',
}

// Get file path for a table
function getTablePath(tableName) {
  const fileName = TABLES[tableName] || `${tableName}.json`
  return path.join(DATA_DIR, fileName)
}

// Read a single table
export function readTable(tableName) {
  try {
    ensureDataDir()
    const filePath = getTablePath(tableName)
    if (!fs.existsSync(filePath)) {
      return []
    }
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading table ${tableName}:`, error)
    return []
  }
}

// Write a single table
export function writeTable(tableName, data) {
  try {
    ensureDataDir()
    const filePath = getTablePath(tableName)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error(`Error writing table ${tableName}:`, error)
    throw error
  }
}

// Read entire database (for backward compatibility)
export function readDatabase() {
  ensureDataDir()
  const db = {}
  for (const tableName of Object.keys(TABLES)) {
    db[tableName] = readTable(tableName)
  }
  return db
}

// Write entire database (for backward compatibility)
export function writeDatabase(data) {
  ensureDataDir()
  for (const [tableName, tableData] of Object.entries(data)) {
    if (TABLES[tableName]) {
      writeTable(tableName, Array.isArray(tableData) ? tableData : [])
    }
  }
}

// Helper to generate UUID
export function generateId() {
  return uuidv4()
}

// Helper to get current timestamp
export function getCurrentTimestamp() {
  return new Date().toISOString()
}

// Helper to convert ISO string to Date object for sorting
export function parseDate(dateString) {
  return new Date(dateString)
}

// Migrate from old single-file database to new multi-file structure
export function migrateToMultiFile() {
  try {
    const oldDbPath = path.join(DATA_DIR, 'database.json')
    if (!fs.existsSync(oldDbPath)) {
      console.log('No old database file found, skipping migration')
      return
    }

    const oldDb = JSON.parse(fs.readFileSync(oldDbPath, 'utf8'))
    
    // Write each table to its own file
    for (const [tableName, tableData] of Object.entries(oldDb)) {
      if (TABLES[tableName]) {
        writeTable(tableName, Array.isArray(tableData) ? tableData : [])
        console.log(`Migrated ${tableName}: ${Array.isArray(tableData) ? tableData.length : 0} records`)
      }
    }

    // Backup old file
    const backupPath = path.join(DATA_DIR, 'database.json.backup')
    fs.copyFileSync(oldDbPath, backupPath)
    console.log('Old database backed up to database.json.backup')
    
    console.log('Migration complete!')
  } catch (error) {
    console.error('Migration error:', error)
  }
}
