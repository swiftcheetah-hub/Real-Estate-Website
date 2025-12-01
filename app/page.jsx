'use client'

import { useState, useEffect } from 'react'
import Navbar from '../src/components/Navbar'
import Hero from '../src/components/Hero'
import About from '../src/components/About'
import Properties from '../src/components/Properties'
import Reviews from '../src/components/Reviews'
import Gallery from '../src/components/Gallery'
import Blog from '../src/components/Blog'
import Booking from '../src/components/Booking'
import Contact from '../src/components/Contact'
import FreeGuide from '../src/components/FreeGuide'
import Footer from '../src/components/Footer'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-dark">
      <Navbar scrollY={scrollY} />
      <Hero />
      <About />
      <Properties />
      <Booking />
      <FreeGuide />
      <Reviews />
      <Gallery />
      <Blog />
      <Contact />
      <Footer />
    </div>
  )
}

