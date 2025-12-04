// Script to migrate data from PostgreSQL to JSON database
// This script should be run from the backend folder where Prisma is installed
// OR install Prisma in frontend: npm install @prisma/client prisma
// Run with: node scripts/migrate-from-postgres.js

const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

// Try to load Prisma from different locations
let PrismaClient
let prismaPath = null

// Strategy: Try to find Prisma in current directory or parent directories
const possiblePaths = [
  // Current directory (if running from backend)
  path.join(process.cwd(), 'node_modules', '@prisma', 'client'),
  // Parent directory (if running from frontend)
  path.join(process.cwd(), '..', 'RealEstate-backend', 'node_modules', '@prisma', 'client'),
  // Script directory relative (if running from backend)
  path.join(__dirname, '..', '..', 'RealEstate-backend', 'node_modules', '@prisma', 'client'),
  // Try direct require first (if in same node_modules)
  null, // Will try require('@prisma/client') directly
]

for (const tryPath of possiblePaths) {
  try {
    if (tryPath === null) {
      // Try direct require
      PrismaClient = require('@prisma/client').PrismaClient
      prismaPath = 'current node_modules'
      break
    } else if (require('fs').existsSync(tryPath)) {
      PrismaClient = require(tryPath).PrismaClient
      prismaPath = tryPath
      break
    }
  } catch (e) {
    // Continue to next path
  }
}

if (!PrismaClient) {
  console.error('❌ Cannot find @prisma/client')
  console.log('\n📦 To fix this:')
  console.log('\nOption 1: Install Prisma in backend folder')
  console.log('  cd RealEstate-backend')
  console.log('  npm install')
  console.log('  node ../RealEstate-frontend/scripts/migrate-from-postgres.js')
  console.log('\nOption 2: Install Prisma in frontend folder')
  console.log('  cd RealEstate-frontend')
  console.log('  npm install @prisma/client prisma')
  console.log('  npm run migrate-data')
  console.log('\nOption 3: Add data manually')
  console.log('  - Use admin panel at /admin')
  console.log('  - Or edit data/database.json directly')
  process.exit(1)
}

const prisma = new PrismaClient()
const DB_PATH = path.join(__dirname, '..', 'data', 'database.json')

async function migrateData() {
  try {
    console.log('Starting data migration from PostgreSQL to JSON...\n')

    // Read existing JSON database (to preserve admin user)
    let jsonDb = {
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

    // Try to read existing JSON file to preserve admin
    if (fs.existsSync(DB_PATH)) {
      try {
        const existing = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
        jsonDb.admins = existing.admins || []
        console.log(`📋 Found existing admin user(s) in JSON file`)
      } catch (e) {
        console.log('⚠️  Could not read existing JSON file, will create new one')
      }
    }

    // Migrate Admins
    try {
      const admins = await prisma.admin.findMany()
      if (admins.length > 0) {
        jsonDb.admins = admins.map(admin => ({
          id: admin.id,
          email: admin.email,
          passwordHash: admin.passwordHash,
          fullName: admin.fullName,
          role: admin.role,
          isActive: admin.isActive,
          lastLogin: admin.lastLogin?.toISOString() || null,
          createdAt: admin.createdAt.toISOString(),
          updatedAt: admin.updatedAt.toISOString(),
        }))
        console.log(`✅ Migrated ${admins.length} admin(s)`)
      } else {
        console.log(`ℹ️  No admins found in database`)
      }
    } catch (error) {
      console.log('⚠️  Could not migrate admins:', error.message)
    }

    // Migrate Agents
    try {
      const agents = await prisma.agent.findMany()
      jsonDb.agents = agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        role: agent.role,
        email: agent.email,
        phone: agent.phone,
        imageUrl: agent.imageUrl,
        description: agent.description,
        education: agent.education,
        specialties: agent.specialties || [],
        certifications: agent.certifications || [],
        achievements: agent.achievements || [],
        isActive: agent.isActive,
        displayOrder: agent.displayOrder,
        createdAt: agent.createdAt.toISOString(),
        updatedAt: agent.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${agents.length} agent(s)`)
    } catch (error) {
      console.log('⚠️  Could not migrate agents:', error.message)
    }

    // Migrate Properties
    try {
      const properties = await prisma.property.findMany()
      jsonDb.properties = properties.map(property => ({
        id: property.id,
        title: property.title,
        address: property.address,
        price: parseFloat(property.price.toString()),
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        areaUnit: property.areaUnit,
        floor: property.floor,
        landSize: property.landSize,
        yearBuilt: property.yearBuilt,
        type: property.type,
        status: property.status,
        description: property.description,
        images: property.images || [],
        features: property.features || [],
        agentId: property.agentId,
        isActive: property.isActive,
        isFeatured: property.isFeatured,
        displayOrder: property.displayOrder,
        createdAt: property.createdAt.toISOString(),
        updatedAt: property.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${properties.length} property/properties`)
    } catch (error) {
      console.log('⚠️  Could not migrate properties:', error.message)
    }

    // Migrate Reviews
    try {
      const reviews = await prisma.review.findMany()
      jsonDb.reviews = reviews.map(review => ({
        id: review.id,
        name: review.name,
        role: review.role,
        imageUrl: review.imageUrl,
        rating: review.rating,
        text: review.text,
        property: review.property,
        agentId: review.agentId,
        displayOrder: review.displayOrder,
        isActive: review.isActive,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${reviews.length} review(s)`)
    } catch (error) {
      console.log('⚠️  Could not migrate reviews:', error.message)
    }

    // Migrate Gallery Items
    try {
      const galleryItems = await prisma.galleryItem.findMany()
      jsonDb.galleryItems = galleryItems.map(item => ({
        id: item.id,
        name: item.name,
        role: item.role,
        imageUrl: item.imageUrl,
        videoUrl: item.videoUrl,
        mediaType: item.mediaType,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${galleryItems.length} gallery item(s)`)
    } catch (error) {
      console.log('⚠️  Could not migrate gallery items:', error.message)
    }

    // Migrate Investors
    try {
      const investors = await prisma.investor.findMany()
      jsonDb.investors = investors.map(investor => ({
        id: investor.id,
        name: investor.name,
        role: investor.role,
        imageUrl: investor.imageUrl,
        testimonial: investor.testimonial,
        displayOrder: investor.displayOrder,
        isActive: investor.isActive,
        createdAt: investor.createdAt.toISOString(),
        updatedAt: investor.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${investors.length} investor(s)`)
    } catch (error) {
      console.log('⚠️  Could not migrate investors:', error.message)
    }

    // Migrate Journeys
    try {
      const journeys = await prisma.journey.findMany()
      jsonDb.journeys = journeys.map(journey => ({
        id: journey.id,
        year: journey.year,
        title: journey.title,
        description: journey.description,
        displayOrder: journey.displayOrder,
        isActive: journey.isActive,
        createdAt: journey.createdAt.toISOString(),
        updatedAt: journey.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${journeys.length} journey milestone(s)`)
    } catch (error) {
      console.log('⚠️  Could not migrate journeys:', error.message)
    }

    // Migrate Contact Info
    try {
      const contactInfo = await prisma.contactInfo.findMany()
      jsonDb.contactInfo = contactInfo.map(info => ({
        id: info.id,
        phone: info.phone,
        phoneHours: info.phoneHours,
        email: info.email,
        emailSupport: info.emailSupport,
        office: info.office,
        isActive: info.isActive,
        createdAt: info.createdAt.toISOString(),
        updatedAt: info.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${contactInfo.length} contact info record(s)`)
    } catch (error) {
      console.log('⚠️  Could not migrate contact info:', error.message)
    }

    // Migrate Contact Messages
    try {
      const messages = await prisma.contactMessage.findMany()
      jsonDb.contactMessages = messages.map(message => ({
        id: message.id,
        firstName: message.firstName,
        lastName: message.lastName,
        email: message.email,
        phone: message.phone,
        agentId: message.agentId,
        message: message.message,
        isRead: message.isRead,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${messages.length} contact message(s)`)
    } catch (error) {
      console.log('⚠️  Could not migrate messages:', error.message)
    }

    // Migrate Bookings
    try {
      const bookings = await prisma.propertyAppraisalBooking.findMany()
      jsonDb.propertyAppraisalBookings = bookings.map(booking => ({
        id: booking.id,
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        phone: booking.phone,
        propertyAddress: booking.propertyAddress,
        propertyType: booking.propertyType,
        notes: booking.notes,
        appointmentDate: booking.appointmentDate?.toISOString() || null,
        appointmentTime: booking.appointmentTime,
        agentId: booking.agentId,
        agentPreference: booking.agentPreference,
        isRead: booking.isRead,
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${bookings.length} booking(s)`)
    } catch (error) {
      console.log('⚠️  Could not migrate bookings:', error.message)
    }

    // Migrate Free Guides
    try {
      const guides = await prisma.freeGuide.findMany()
      jsonDb.freeGuides = guides.map(guide => ({
        id: guide.id,
        title: guide.title,
        description: guide.description,
        fileUrl: guide.fileUrl,
        fileName: guide.fileName,
        fileSize: guide.fileSize,
        isActive: guide.isActive,
        downloadCount: guide.downloadCount,
        createdAt: guide.createdAt.toISOString(),
        updatedAt: guide.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${guides.length} free guide(s)`)
    } catch (error) {
      console.log('⚠️  Could not migrate free guides:', error.message)
    }

    // Migrate Guide Downloads
    try {
      const downloads = await prisma.guideDownload.findMany()
      jsonDb.guideDownloads = downloads.map(download => ({
        id: download.id,
        guideId: download.guideId,
        fullName: download.fullName,
        email: download.email,
        isRead: download.isRead,
        createdAt: download.createdAt.toISOString(),
        updatedAt: download.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${downloads.length} guide download(s)`)
    } catch (error) {
      console.log('⚠️  Could not migrate guide downloads:', error.message)
    }

    // Migrate Buyers
    try {
      const buyers = await prisma.buyer.findMany()
      jsonDb.buyers = buyers.map(buyer => ({
        id: buyer.id,
        fullName: buyer.fullName,
        email: buyer.email,
        phone: buyer.phone,
        buyerType: buyer.buyerType,
        budgetRange: buyer.budgetRange,
        bedrooms: buyer.bedrooms,
        bathrooms: buyer.bathrooms,
        garage: buyer.garage,
        preferredSuburbs: buyer.preferredSuburbs,
        landSize: buyer.landSize,
        additionalPreferences: buyer.additionalPreferences,
        preApproved: buyer.preApproved,
        isActive: buyer.isActive,
        createdAt: buyer.createdAt.toISOString(),
        updatedAt: buyer.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${buyers.length} buyer(s)`)
    } catch (error) {
      console.log('⚠️  Could not migrate buyers:', error.message)
    }

    // Migrate Buyer Enquiries
    try {
      const enquiries = await prisma.buyerEnquiry.findMany()
      jsonDb.buyerEnquiries = enquiries.map(enquiry => ({
        id: enquiry.id,
        buyerId: enquiry.buyerId,
        agentName: enquiry.agentName,
        agentPhone: enquiry.agentPhone,
        agentEmail: enquiry.agentEmail,
        agencyOffice: enquiry.agencyOffice,
        preferredSplit: enquiry.preferredSplit,
        isRead: enquiry.isRead,
        createdAt: enquiry.createdAt.toISOString(),
        updatedAt: enquiry.updatedAt.toISOString(),
      }))
      console.log(`✅ Migrated ${enquiries.length} buyer enquiry/enquiries`)
    } catch (error) {
      console.log('⚠️  Could not migrate buyer enquiries:', error.message)
    }

    // Write to JSON file
    const dataDir = path.dirname(DB_PATH)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(jsonDb, null, 2), 'utf8')

    console.log('\n✅ Migration complete!')
    console.log(`📁 Database saved to: ${DB_PATH}`)
    console.log('\n📊 Summary:')
    console.log(`- Admins: ${jsonDb.admins.length}`)
    console.log(`- Agents: ${jsonDb.agents.length}`)
    console.log(`- Properties: ${jsonDb.properties.length}`)
    console.log(`- Reviews: ${jsonDb.reviews.length}`)
    console.log(`- Gallery Items: ${jsonDb.galleryItems.length}`)
    console.log(`- Investors: ${jsonDb.investors.length}`)
    console.log(`- Journeys: ${jsonDb.journeys.length}`)
    console.log(`- Contact Messages: ${jsonDb.contactMessages.length}`)
    console.log(`- Bookings: ${jsonDb.propertyAppraisalBookings.length}`)
    console.log(`- Free Guides: ${jsonDb.freeGuides.length}`)
    console.log(`- Buyers: ${jsonDb.buyers.length}`)
    console.log(`- Buyer Enquiries: ${jsonDb.buyerEnquiries.length}`)

  } catch (error) {
    console.error('❌ Migration error:', error)
    console.log('\n⚠️  This usually means:')
    console.log('1. PostgreSQL database is not running')
    console.log('2. DATABASE_URL in .env is incorrect')
    console.log('3. Database connection failed')
    console.log('\n💡 Alternative: Add data manually through admin panel or edit data/database.json')
  } finally {
    await prisma.$disconnect()
  }
}

migrateData()
