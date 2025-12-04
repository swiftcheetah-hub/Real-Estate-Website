'use client'

import React from 'react'
import Link from 'next/link'
import { Search, UserPlus, ArrowRight } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const MatchBuyer = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <section id="match-buyer" ref={sectionRef} className={`py-24 px-4 sm:px-6 lg:px-8 bg-dark section-animate section-fade-up ${sectionVisible ? 'animate-in' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Match <span className="text-primary">Buyer</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Connect with potential buyers looking for properties that match your listing. Browse our current buyer database or register as a buyer.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
          <Link
            href="/match-buyer/database"
            className="group w-full sm:w-auto px-8 py-4 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
          >
            <Search className="w-5 h-5" />
            <span>View Full Match Buyer Database</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/match-buyer/register"
            className="group w-full sm:w-auto px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>Register as a Buyer</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default MatchBuyer



