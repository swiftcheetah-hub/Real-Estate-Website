'use client'

import { useState, useEffect } from 'react'
import Navbar from '../../src/components/Navbar'
import Footer from '../../src/components/Footer'
import MatchBuyer from '../../src/components/MatchBuyer'

export default function MatchBuyerPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-dark">
      <Navbar scrollY={scrollY} />
      <div className="pt-20">
        <MatchBuyer />
      </div>
      <Footer />
    </div>
  )
}



