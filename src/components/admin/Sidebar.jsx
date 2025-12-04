'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, UserPlus, Calendar, TrendingUp, Quote, Phone, Image as ImageIcon, Home, CalendarCheck, FileText, Users, Mail } from 'lucide-react'

const Sidebar = () => {
  const pathname = usePathname()

  const menuItems = [
    {
      name: 'Admin Dashboard',
      href: '/admin',
      icon: User,
      active: pathname === '/admin',
    },
    {
      name: 'Agent Registration',
      href: '/admin/agents/register',
      icon: UserPlus,
      active: pathname === '/admin/agents/register',
    },
    {
      name: 'Properties Management',
      href: '/admin/properties',
      icon: Home,
      active: pathname === '/admin/properties',
    },
    {
      name: 'Journey Management',
      href: '/admin/journeys',
      icon: Calendar,
      active: pathname === '/admin/journeys',
    },
    {
      name: 'Investor Management',
      href: '/admin/investors',
      icon: TrendingUp,
      active: pathname === '/admin/investors',
    },
    {
      name: 'Review Management',
      href: '/admin/reviews',
      icon: Quote,
      active: pathname === '/admin/reviews',
    },
    {
      name: 'Contact Management',
      href: '/admin/contact',
      icon: Phone,
      active: pathname === '/admin/contact',
    },
    {
      name: 'Gallery Management',
      href: '/admin/gallery',
      icon: ImageIcon,
      active: pathname === '/admin/gallery',
    },
    {
      name: 'Appraisal Bookings',
      href: '/admin/bookings',
      icon: CalendarCheck,
      active: pathname === '/admin/bookings',
    },
    {
      name: 'Free Guide Management',
      href: '/admin/free-guide',
      icon: FileText,
      active: pathname === '/admin/free-guide',
    },
    {
      name: 'Match Buyer Management',
      href: '/admin/buyers',
      icon: Users,
      active: pathname === '/admin/buyers',
    },
    {
      name: 'Buyer Enquiry History',
      href: '/admin/buyer-enquiries',
      icon: Mail,
      active: pathname === '/admin/buyer-enquiries',
    },
  ]

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-dark border-r border-primary/20 pt-6 overflow-y-auto">
      <nav className="px-4 space-y-2 pb-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = item.active

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-black font-semibold'
                  : 'text-gray-300 hover:bg-dark-lighter hover:text-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar

