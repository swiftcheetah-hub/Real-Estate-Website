'use client'

import React from 'react'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const Blog = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.1 })
  const blogPosts = [
    {
      id: 1,
      title: '10 Tips for First-Time Home Buyers in 2024',
      excerpt: 'Navigate the real estate market with confidence using these expert tips tailored for first-time buyers.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      date: 'Nov 5, 2024',
      readTime: '5 min read',
      category: 'Buying Guide',
      author: 'Sarah Mitchell',
    },
    {
      id: 2,
      title: 'The Rise of Smart Homes: Technology Trends',
      excerpt: 'Discover how smart home technology is transforming modern luxury real estate and what buyers expect.',
      image: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800',
      date: 'Nov 1, 2024',
      readTime: '7 min read',
      category: 'Technology',
      author: 'Michael Chen',
    },
    {
      id: 3,
      title: 'Investment Strategies for Luxury Real Estate',
      excerpt: 'Learn proven strategies for investing in high-end properties and maximizing your returns in today\'s market.',
      image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800',
      date: 'Oct 28, 2024',
      readTime: '6 min read',
      category: 'Investment',
      author: 'Sarah Mitchell',
    },
    {
      id: 4,
      title: 'How to Stage Your Home for Maximum Appeal',
      excerpt: 'Professional staging tips that will help your property stand out and sell faster in today\'s competitive market.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      date: 'Oct 25, 2024',
      readTime: '4 min read',
      category: 'Selling Tips',
      author: 'Michael Chen',
    },
    {
      id: 5,
      title: 'Neighborhood Spotlight: Beverly Hills Living',
      excerpt: 'Explore what makes Beverly Hills one of the most sought-after locations for luxury home buyers and investors.',
      image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800',
      date: 'Oct 20, 2024',
      readTime: '8 min read',
      category: 'Location Guide',
      author: 'Sarah Mitchell',
    },
    {
      id: 6,
      title: 'Understanding Market Trends in 2024',
      excerpt: 'An in-depth analysis of current real estate market trends and what they mean for buyers and sellers.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      date: 'Oct 15, 2024',
      readTime: '6 min read',
      category: 'Market Analysis',
      author: 'Michael Chen',
    },
  ]

  return (
    <section id="blog" ref={sectionRef} className={`py-24 px-4 sm:px-6 lg:px-8 bg-dark section-animate section-fade-up ${sectionVisible ? 'animate-in' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            Latest Insights
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Stay informed with expert advice, market trends, and insider tips from our experienced agents
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, idx) => (
            <article
              key={post.id}
              className={`bg-dark-light rounded-2xl overflow-hidden border border-primary/20 hover:border-primary/40 transition-all duration-300 group cursor-pointer section-animate section-scale ${sectionVisible ? 'animate-in' : ''}`}
              style={{ transitionDelay: `${idx * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-black text-sm font-semibold rounded-full">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>

                {/* Author and Read More */}
                <div className="flex items-center justify-between pt-4 border-t border-primary/20">
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{post.author}</span>
                  </div>
                  <button className="text-primary font-semibold hover:text-primary-light transition-colors flex items-center gap-1">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Articles Button */}
        <div className="text-center">
          <button className="px-8 py-4 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all duration-300">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  )
}

export default Blog
