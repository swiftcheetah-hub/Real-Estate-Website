import React from 'react'
import { Building2, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'About Us', href: '/#about' },
    { name: 'Properties', href: '/#properties' },
    { name: 'Reviews', href: '/#reviews' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Blog', href: '/#blog' },
    { name: 'Book Appraisal', href: '/#booking' },
  ]

  const services = [
    'Property Sales',
    'Property Rentals',
    'Property Management',
    'Investment Consulting',
    'Market Analysis',
    'Home Staging',
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Linkedin, href: '#', name: 'LinkedIn' },
  ]

  const handleLinkClick = (href) => {
    if (href.startsWith('/#')) {
      const id = href.substring(2)
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="bg-dark-light border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold gradient-text">Elite Properties</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted partners in finding the perfect property. Excellence in real estate
              since 2010.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 glass border border-primary/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-gray-400 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  1234 Real Estate Ave,<br />
                  Beverly Hills, CA 90210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+15551234567" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:info@eliteproperties.com" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  info@eliteproperties.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Elite Properties. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <button className="hover:text-primary transition-colors">Privacy Policy</button>
              <button className="hover:text-primary transition-colors">Terms of Service</button>
              <button className="hover:text-primary transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

