'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Home, MapPin, Star } from 'lucide-react'

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-dark pt-20 overflow-hidden">
      {/* Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80"
          alt="Luxury Property Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-6 lg:space-y-8">
            {/* Award Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-primary border border-primary mb-6">
              <Star className="w-4 h-4 text-black fill-black" />
              <span className="text-sm font-semibold text-black">Award-Winning Real Estate Team</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">Find Your</span>
              <br />
              <span className="text-primary">Dream Property</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white leading-relaxed max-w-xl">
              Experience luxury living with Elite Properties. We specialize in premium real estate with over 25 years of combined expertise, delivering exceptional results for our clients.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#properties"
                className="group px-8 py-4 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Explore Properties</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group px-8 py-4 bg-dark border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all duration-300 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Video Tour</span>
              </button>
            </div>

            {/* Stats - Positioned at bottom of left section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              {[
                { value: '$250M+', label: 'Total Sales' },
                { value: '380+', label: 'Properties Sold' },
                { value: '350+', label: 'Happy Clients' },
                { value: '98%', label: 'Satisfaction' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-dark-lighter/80 backdrop-blur-sm rounded-xl p-4 border border-primary/30 text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-white">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Featured Property Card */}
          <div className="relative">
            {/* Main Property Image */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl">
              <div className="relative h-[500px] md:h-[600px]">
                <img
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
                  alt="Modern Luxury Villa"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
                
                {/* 380+ Properties Sold Badge (Mid-Left) - Positioned on the left side, mid-height */}
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-dark-lighter/90 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-primary/30 shadow-lg z-10">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm font-semibold">380+</div>
                      <div className="text-white/80 text-xs">Properties Sold</div>
                    </div>
                  </div>
                </div>
                
                {/* Expert Agents Card (Top Right) - Yellow Card with Two Profile Images */}
                <div className="absolute top-4 right-4 bg-primary rounded-xl px-4 py-3 border-2 border-primary shadow-xl z-10">
                  {/* Two Circular Profile Images at Top */}
                  <div className="flex items-center gap-2 mb-2">
                    {/* Sarah Mitchell - First Profile */}
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img
                        src="https://cdn6.ep.dynamics.net/s3/rw-media/memberphotos/b848290e-2702-4394-99c5-d56874cb0654.png?height=828&maxheight=2560&maxwidth=2560&quality=90&scale=both&width=828&format=webp"
                        alt="Imran Chowdhury"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Michael Chen - Second Profile (overlapping) */}
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden -ml-2">
                      <img
                        src="https://cdn6.ep.dynamics.net/s3/rw-media/memberphotos/0cb305ee-6c8d-48c2-90c6-9023200ae177.jpg?height=828&maxheight=2560&maxwidth=2560&quality=90&scale=both&width=828&format=webp"
                        alt="Rafsan Hasan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Text Below Images */}
                  <div>
                    <div className="text-black font-bold text-sm">Expert Agents</div>
                    <div className="text-black/80 text-xs">25+ Years Experience</div>
                  </div>
                </div>

                {/* Property Details Overlay (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center text-white/90 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                    Beverly Hills, CA
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Modern Luxury Villa</h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl md:text-5xl font-bold text-primary">$4.5M</div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white text-sm">
                    <span>5 Beds</span>
                    <span className="text-primary">•</span>
                    <span>6 Baths</span>
                    <span className="text-primary">•</span>
                    <span>6,500 sqft</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Property Preview Card (Partially Visible Below) */}
            <div className="absolute -bottom-6 -right-6 bg-dark-lighter rounded-xl p-4 border-2 border-primary/30 w-56 shadow-2xl z-10">
              <img
                src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600"
                alt="Penthouse Suite"
                className="w-full h-28 object-cover rounded-lg mb-2"
              />
              <div className="text-primary font-semibold text-lg">$3.2M</div>
              <div className="text-sm text-white">Penthouse Suite</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Bottom Center */}
        <div className="absolute left-1/2 bottom-[-30px] transform -translate-x-1/2 text-center z-20 animate-fade-in-up">
          <div className="text-white text-sm mb-3 opacity-80">Scroll to explore</div>
          <div className="flex flex-col items-center animate-bounce-slow">
            {/* Top Circle - Pulsing */}
            <div className="w-2 h-2 bg-primary rounded-full border-2 border-dark mb-1 animate-pulse-slow" />
            {/* Scroll Track with Animated Line */}
            <div className="w-8 h-10 border-2 border-primary rounded-full flex items-start justify-center pt-2 relative overflow-hidden">
              <div className="w-1 h-3 bg-primary rounded-full animate-scroll-down" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
