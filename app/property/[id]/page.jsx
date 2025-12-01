'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '../../../src/components/Navbar'
import PropertyDetails from '../../../src/components/PropertyDetails'
import Footer from '../../../src/components/Footer'

export default function PropertyPage() {
  const [scrollY, setScrollY] = useState(0)
  const params = useParams()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-dark">
      <Navbar scrollY={scrollY} />
      <PropertyDetails />
      <Footer />
    </div>
  )
}

