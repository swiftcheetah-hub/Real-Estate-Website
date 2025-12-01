# Real Estate Portfolio Website

A modern, engaging portfolio website for two real estate agents showcasing properties, reviews, gallery, blogs, and more.

## Features

- 🏠 **Properties Section** - Browse and filter luxury properties with detailed listings
- ⭐ **Reviews** - Client testimonials and ratings
- 📸 **Gallery** - Beautiful property gallery with lightbox view
- 📝 **Blog** - Latest real estate insights and market updates
- 👥 **About** - Team profiles, company story, and core values
- 📅 **Booking System** - Interactive calendar for property appraisals
- 📊 **Property Details** - Comprehensive property pages with social insights, analytics, and engagement metrics
- 🎨 **Dark Theme** - Modern dark theme with yellow primary color and black secondary

## Design

- **Theme**: Dark (#0a0a0a) with yellow (#fbbf24) primary and black secondary
- **Responsive**: Fully responsive design for all devices
- **Animations**: Smooth transitions and hover effects
- **Glass Morphism**: Modern glassmorphic UI elements

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

The development server will automatically reload when you make changes.

### Build for Production

```bash
npm run build
```

The built files will be in the `.next` directory.

To start the production server:

```bash
npm start
```

## Project Structure

```
portfolio/
├── app/
│   ├── layout.jsx          # Root layout
│   ├── page.jsx            # Home page
│   ├── globals.css         # Global styles
│   └── property/
│       └── [id]/
│           └── page.jsx    # Dynamic property detail page
├── src/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── Blog.jsx
│   │   ├── Booking.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── FreeGuide.jsx
│   │   ├── Gallery.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── Properties.jsx
│   │   ├── PropertyDetails.jsx
│   │   └── Reviews.jsx
│   └── hooks/
│       └── useScrollAnimation.js
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React** - UI library
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Features Breakdown

### Hero Section
- Full-screen immersive design
- Animated background images
- Call-to-action buttons
- Live statistics display

### Properties
- Filterable property listings
- Property cards with images and details
- Click to view detailed property pages

### Reviews
- Client testimonials
- Star ratings
- Property references
- Client photos

### Gallery
- Grid layout with lightbox
- Category tags
- Smooth transitions

### Blog
- Latest articles
- Category tags
- Read time estimates
- Publication dates

### About
- Company statistics
- Team profiles
- Core values
- Company timeline

### Booking
- 3-step booking process
- Interactive calendar
- Time slot selection
- Agent selection (both agents default)
- Property details form

### Property Details
- Image carousel
- Complete property information
- Social reach metrics
- Engagement analytics
- Price trend charts
- Agent contact form

## Customization

### Colors
Edit `tailwind.config.js` to customize colors:
- Primary: `#fbbf24` (yellow)
- Secondary: `#000000` (black)
- Dark: `#0a0a0a` (dark background)

### Content
Update property data, agent information, and blog posts in their respective component files.

## License

This project is open source and available for personal and commercial use.

