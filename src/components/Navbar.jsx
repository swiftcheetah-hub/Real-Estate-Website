'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, Home, User, Building2, Star, Image, BookOpen, Calendar, Download, Users } from 'lucide-react'

const Navbar = ({ scrollY }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [siteSettings, setSiteSettings] = useState(null)

  useEffect(() => {
    // Fetch site settings for logo
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => setSiteSettings(data))
      .catch(err => console.error('Error fetching site settings:', err))
  }, [])

  useEffect(() => {
    setScrolled(scrollY > 50)
    
    // Update active section based on scroll position
    const handleScroll = () => {
      const sections = ['home', 'about', 'properties', 'booking', 'free-guide', 'reviews', 'gallery', 'blog', 'match-buyer', 'contact']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollY])

  const navItems = [
    { name: 'Home', href: '/#home', id: 'home', icon: Home },
    { name: 'About', href: '/#about', id: 'about', icon: User },
    { name: 'Properties', href: '/#properties', id: 'properties', icon: Building2 },
    { name: 'Appraisal', href: '/#booking', id: 'booking', icon: Calendar },
    { name: 'Free Guide', href: '/#free-guide', id: 'free-guide', icon: Download },
    { name: 'Reviews', href: '/#reviews', id: 'reviews', icon: Star },
    { name: 'Gallery', href: '/#gallery', id: 'gallery', icon: Image },
    { name: 'Blog', href: '/#blog', id: 'blog', icon: BookOpen },
    { name: 'Match Buyer', href: '/#match-buyer', id: 'match-buyer', icon: Users },
    { name: 'Contact', href: '/#contact', id: 'contact', icon: User },
  ]

  const handleNavClick = (href, id) => {
    if (href.startsWith('/#')) {
      if (pathname === '/') {
        const sectionId = href.substring(2)
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
          setActiveSection(id)
        }
      } else {
        // If not on home page, navigate to home page with hash
        router.push(href)
      }
    } else {
      router.push(href)
    }
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark/95 backdrop-blur-md border-b border-primary/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {siteSettings?.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt={siteSettings.siteName || 'Logo'}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">EP</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">{siteSettings?.siteName || 'Elite Properties'}</span>
              <span className="text-xs text-gray-400">{siteSettings?.siteTagline || 'Luxury Real Estate'}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = pathname === '/' 
                ? activeSection === item.id 
                : item.href.startsWith('/') && !item.href.startsWith('/#')
                  ? pathname === item.href || pathname.startsWith(item.href + '/')
                  : pathname === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href, item.id)}
                  className={`relative px-2 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10 rounded-lg'
                      : 'text-gray-300 hover:text-primary'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-primary hover:bg-dark-lighter transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-dark border-t border-primary/20">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href, item.id)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-primary hover:bg-dark-lighter transition-all duration-200"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

