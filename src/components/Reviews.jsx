'use client'

import React, { useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const Reviews = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.1 })
  const [reviews, setReviews] = useState([])
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews/public`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      // Fallback to default reviews
      setReviews([
        {
          id: 1,
          name: 'Sina Soth',
          role: 'CEO, Tech Startup',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
          rating: 5,
          text: "As a first-time property investor, I really appreciated how easy and straight-forward he made the whole process. It was clear, genuine communication from start to finish and I'd recommend Imranto anyone who values the same approach",
          property: 'Luxury Villa, Beverly Hills',
          agent: 'Imran Chowdhury',
        },
        {
          id: 2,
          name: 'Sunvi Ahsan',
          role: 'Investment Banker',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
          rating: 5,
          text: 'A very sharp agent who is hard working , great on communication & straight up. Ample of confidence ,he has a very great future ahead and exceeded all my expectations!',
          property: 'Penthouse, Manhattan',
          agent: 'Rafsan Hasan',
        },
        {
          id: 3,
          name: 'Sina Soth',
          role: 'Interior Designer',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
          rating: 5,
          text: "Working with Siniva was fantastic—her eye for design elevated our property and helped us sell for top dollar. Her communication and vision made the process seamless from start to finish.",
          property: 'Modern Estate, Miami',
          agent: 'Imran Chowdhury',
        },
        {
          id: 4,
          name: 'Amad Khan',
          role: 'Entrepreneur',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
          rating: 5,
          text: 'We listed this property a couple of times with other agents after moving to Australia with little to no success. After I heard you entered the real estate market and knowing how hard you work to get the job done. I knew you were the man for the job and even remotely I could see online all the hard work you and your team were putting in to make this happen and surprisingly quick. Never accept failure, always keep pushing the limits and being creative. Thank you to you and your team for making this happen!',
          property: 'Residence, Austin',
          agent: 'Rafsan Hasan',
        },
        {
          id: 5,
          name: 'Marighay Loterte',
          role: 'Medical Professional',
          image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
          rating: 5,
          text: "We're so thankful to Imran for all the help in securing our new home. He was always supportive, honest, and went the extra mile to make it happen. We truly appreciate his effort and care,thank you for making our dream home possible",
          property: 'Masterpiece, Los Angeles',
          agent: 'Imran Chowdhury',
        },
        {
          id: 6,
          name: 'Lino',
          role: 'Corporate Executive',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
          rating: 5,
          text: 'Communication on point , helpful thru out the whole process 🙏 highly recommend the brother here💯',
          property: 'Urban Apartment, San Francisco',
          agent: 'Rafsan Hasan',
        },
      ])
    }
  }

  return (
    <section id="reviews" ref={sectionRef} className={`py-24 px-4 sm:px-6 lg:px-8 bg-dark section-animate section-fade-up ${sectionVisible ? 'animate-in' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            Client Testimonials
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Hear what our satisfied clients have to say about their experience working with us.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {reviews.map((review, idx) => (
            <div
              key={review.id || idx}
              className={`bg-dark-light rounded-xl p-6 border border-primary/30 relative hover:border-primary/50 transition-all duration-300 section-animate section-scale ${sectionVisible ? 'animate-in' : ''}`}
              style={{ transitionDelay: `${idx * 0.1}s` }}
            >
              {/* Large Quote Icon */}
              <div className="absolute top-4 right-4">
                <Quote className="w-16 h-16 text-primary/20" />
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-4 mb-4">
                {review.imageUrl ? (
                  <img
                    src={review.imageUrl}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center ${
                    review.imageUrl ? 'hidden' : ''
                  }`}
                >
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-white">{review.name}</div>
                  {review.role && (
                    <div className="text-sm text-gray-400">{review.role}</div>
                  )}
                </div>
              </div>

              {/* Rating */}
              {review.rating && (
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
              )}

              {/* Review Text */}
              {review.text && (
                <p className="text-white mb-4 leading-relaxed">{review.text}</p>
              )}

              {/* Property */}
              {review.property && (
                <div className="text-sm text-gray-400 mb-2">
                  {review.property}
                </div>
              )}

              {/* Agent */}
              {review.agentName && (
                <div className="text-sm text-primary font-medium">
                  Agent: {review.agentName}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="bg-dark-light rounded-xl p-8 border border-primary/20">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">4.9/5.0</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-primary/20"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">350+</div>
              <div className="text-gray-400 text-sm">Happy Clients</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-primary/20"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">98%</div>
              <div className="text-gray-400 text-sm">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Reviews
