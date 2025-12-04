# Real Estate Portfolio

A modern real estate portfolio website with integrated admin panel.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Initialize admin user
npm run init-admin

# Start development server
npm run dev
```

**Default admin credentials:**
- Email: `admin@eliteproperties.com`
- Password: `admin123`

## 📁 Project Structure

```
RealEstate-frontend/
├── app/
│   ├── api/              # API routes (replaces backend)
│   ├── admin/            # Admin pages
│   └── ...               # Public pages
├── lib/
│   ├── db.js            # Database utilities (JSON file management)
│   └── auth.js          # Authentication utilities
├── data/
│   └── database.json    # JSON database file (direct file management)
└── src/
    └── components/      # React components
```

## 🗄️ Database: Direct File Management

The application uses **JSON file storage** (`data/database.json`) for direct data management:

- ✅ **No External Database**: No PostgreSQL, Prisma, or SQL needed
- ✅ **Direct Access**: Read/write directly to JSON file
- ✅ **Editable**: You can edit `data/database.json` directly
- ✅ **Simple**: JSON format is easy to understand and manage
- ✅ **Portable**: Database file can be version controlled

**How It Works**:
- All API routes use `lib/db.js` to read/write `data/database.json`
- `readDatabase()` - Reads the JSON file
- `writeDatabase(data)` - Writes data back to JSON file
- All operations are direct file I/O

## ➕ Adding Data

### Method 1: Admin Panel (Recommended) ⭐

1. Start app: `npm run dev`
2. Login: `http://localhost:3000/admin/login`
3. Use admin panel to add:
   - Properties, Agents, Reviews, Gallery, etc.
4. Data is automatically saved to `data/database.json`

### Method 2: Edit JSON File Directly

Open `data/database.json` and add data to the arrays. See `HOW_TO_ADD_DATA.md` for examples.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run init-admin` - Initialize admin user

## 📝 Features

- ✅ Property listings with filtering
- ✅ Agent profiles
- ✅ Client reviews
- ✅ Gallery (images/videos)
- ✅ Contact forms
- ✅ Property booking/appraisal
- ✅ Free guide downloads
- ✅ Match buyer system
- ✅ Full admin panel

## 🔐 Admin Panel

Access the admin panel at `/admin/login`:
- Manage properties, agents, reviews
- View messages and bookings
- Manage gallery and investors
- Full CRUD operations for all entities

## 📦 Dependencies

- Next.js 14
- React 18
- Tailwind CSS
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- uuid (ID generation)

## 🌐 Deployment

The application is ready for deployment on Vercel:
- Single Next.js app
- No external database needed
- JSON file storage works in serverless environment

## 📚 Documentation

- `SIMPLE_SOLUTION.md` - How to add data (recommended)
- `HOW_TO_ADD_DATA.md` - Examples of adding data
- `DATABASE_APPROACH.md` - Database approach explanation
- `INTEGRATION_SUMMARY.md` - Complete integration details

## ⚠️ Important Notes

- **Database**: JSON file (`data/database.json`) - edit directly or use admin panel
- **File Uploads**: Consider cloud storage (Cloudinary, AWS S3) for production
- **Environment**: Set `JWT_SECRET` in `.env.local` for production
