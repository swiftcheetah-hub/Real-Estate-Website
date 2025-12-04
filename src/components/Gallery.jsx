'use client'

import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.1 })

  useEffect(() => {
    fetchGalleryItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery/public')
      if (response.ok) {
        const data = await response.json()
        // Filter out items that have neither image nor video, and map the data
        setGalleryImages(data
          .filter(item => item.imageUrl || item.videoUrl) // Only show items with at least one media
          .map(item => ({
            id: item.id,
            title: item.name,
            category: item.role,
            url: item.imageUrl || item.videoUrl,
            mediaType: item.videoUrl ? 'video' : 'image',
            videoUrl: item.videoUrl,
            imageUrl: item.imageUrl,
          })))
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error)
      // Fallback to default gallery images
      setGalleryImages([
    {
      id: 1,
      title: 'Modern Living Room',
      category: 'Interior',
      url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    },
    {
      id: 2,
      title: 'Luxury Exterior',
      category: 'Exterior',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    },
    {
      id: 3,
      title: 'Designer Kitchen',
      category: 'Interior',
      url: 'https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwbHV4dXJ5fGVufDF8fHx8MTc2Mjg1NTEwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      title: 'Master Bedroom',
      category: 'Interior',
      url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    },
    {
      id: 5,
      title: 'Outdoor Pool',
      category: 'Exterior',
      url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800',
    },
    {
      id: 6,
      title: 'Elegant Bathroom',
      category: 'Interior',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    },
    {
      id: 7,
      title: 'Contemporary Home',
      category: 'Exterior',
      url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
    },
    {
      id: 8,
      title: 'Home Office',
      category: 'Interior',
      url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    },
    {
      id: 9,
      title: 'Garden View',
      category: 'Exterior',
      url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    },
      ])
    }
  }

  const openLightbox = (image) => {
    setSelectedImage(image)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction) => {
    if (!selectedImage || galleryImages.length === 0) return
    const currentIndex = galleryImages.findIndex(img => 
      (img.id && selectedImage.id && img.id === selectedImage.id) || 
      (img.title === selectedImage.title && img.url === selectedImage.url)
    )
    if (currentIndex === -1) return
    let newIndex
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % galleryImages.length
    } else {
      newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length
    }
    setSelectedImage(galleryImages[newIndex])
  }

  return (
    <section id="gallery" ref={sectionRef} className={`py-24 px-4 sm:px-6 lg:px-8 bg-dark section-animate section-fade-up ${sectionVisible ? 'animate-in' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            Property Gallery
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Explore stunning visuals of our luxury properties and their exquisite interiors
          </p>
        </div>

        {/* Gallery Grid - 3x3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((item, idx) => {
            const hasImage = item.imageUrl
            const hasVideo = item.videoUrl
            const showBoth = hasImage && hasVideo
            
            return (
              <div
                key={item.id}
                className={`relative group cursor-pointer overflow-hidden rounded-xl aspect-square section-animate section-scale ${sectionVisible ? 'animate-in' : ''}`}
                style={{ transitionDelay: `${idx * 0.05}s` }}
                onClick={() => openLightbox(item)}
              >
                {/* If both image and video exist, show image as preview */}
                {showBoth ? (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <video
                      src={item.videoUrl}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => {
                        e.target.play()
                      }}
                      onMouseLeave={(e) => {
                        e.target.pause()
                        e.target.currentTime = 0
                      }}
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center">
                        <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </>
                ) : hasVideo ? (
                  // Only video - show video with play button
                  <>
                    <video
                      src={item.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => {
                        e.target.play()
                      }}
                      onMouseLeave={(e) => {
                        e.target.pause()
                        e.target.currentTime = 0
                      }}
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                        <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </>
                ) : (
                  // Only image
                  <img
                    src={item.url || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <div className="text-white text-xl font-bold mb-1">{item.title}</div>
                  <div className="text-gray-300 text-sm">{item.category}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('prev')
            }}
            className="absolute left-4 text-white hover:text-primary transition-colors z-10"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('next')
            }}
            className="absolute right-4 text-white hover:text-primary transition-colors z-10"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div
            className="max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImage.videoUrl ? (
              <video
                src={selectedImage.videoUrl}
                controls
                autoPlay
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <img
                src={selectedImage.url || selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg"
              />
            )}
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
              <p className="text-primary">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery
