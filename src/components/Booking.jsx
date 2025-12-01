'use client'

import React, { useState } from 'react'
import { Calendar, Clock, User, CheckCircle, ArrowRight, ArrowLeft, Star, ChevronDown } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const Booking = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.1 })
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedAgent, setSelectedAgent] = useState('both')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    propertyType: '',
    notes: '',
  })
  const [bookingComplete, setBookingComplete] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM',
  ]

  const propertyTypes = [
    'Single Family Home',
    'Condo/Apartment',
    'Townhouse',
    'Multi-Family',
    'Commercial',
    'Land',
  ]

  const agents = [
    {
      id: 'both',
      name: 'Both Agents Available',
      description: "We'll assign the best available agent for your property",
      recommended: true,
      image1: 'https://images.unsplash.com/photo-1652878530627-cc6f063e3947?w=600',
      image2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
    },
    {
      id: 'sarah',
      name: 'Sarah Mitchell',
      specialty: 'Luxury Residential',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
    },
    {
      id: 'michael',
      name: 'Michael Chen',
      specialty: 'Commercial & Investment',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1652878530627-cc6f063e3947?w=600',
    },
  ]

  const benefits = [
    {
      icon: CheckCircle,
      title: 'Free Property Valuation',
      description: 'Get an accurate market value assessment at no cost.',
    },
    {
      icon: Clock,
      title: 'Quick & Convenient',
      description: '30-minute consultation at your preferred time.',
    },
    {
      icon: User,
      title: 'Expert Analysis',
      description: 'Professional evaluation by experienced agents.',
    },
    {
      icon: Calendar,
      title: 'Detailed Report',
      description: 'Comprehensive property assessment report.',
    },
    {
      icon: CheckCircle,
      title: 'No Obligation',
      description: 'Free consultation with no commitment required. Get expert insights into your property\'s value.',
    },
  ]

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const days = getDaysInMonth(currentMonth)

  const isPastDate = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleDateSelect = (date) => {
    if (date && !isPastDate(date)) {
      setSelectedDate(date)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setBookingComplete(true)
  }

  if (bookingComplete) {
    return (
      <section id="booking" ref={sectionRef} className={`py-24 px-4 sm:px-6 lg:px-8 bg-dark section-animate section-fade-up ${sectionVisible ? 'animate-in' : ''}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-dark-lighter rounded-2xl p-12 border border-gray-700">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">Appraisal Booked Successfully!</h2>
            <p className="text-gray-400 mb-8">
              Your property appraisal has been scheduled successfully.
            </p>
            <div className="bg-dark rounded-xl p-6 border border-gray-700 mb-8 text-left max-w-md mx-auto">
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Date:</span>{' '}
                  <span className="text-white font-semibold">
                    {selectedDate?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Time:</span>{' '}
                  <span className="text-white font-semibold">{selectedTime}</span>
                </div>
                <div>
                  <span className="text-gray-400">Agent:</span>{' '}
                  <span className="text-white font-semibold">
                    {selectedAgent === 'both'
                      ? 'Both Agents (Best Available)'
                      : agents.find((a) => a.id === selectedAgent)?.name}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setBookingComplete(false)
                setStep(1)
                setSelectedDate(null)
                setSelectedTime(null)
                setSelectedAgent('both')
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  address: '',
                  propertyType: '',
                  notes: '',
                })
              }}
              className="px-8 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all"
            >
              Book Another Appraisal
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" ref={sectionRef} className={`py-24 px-4 sm:px-6 lg:px-8 bg-dark section-animate section-fade-up ${sectionVisible ? 'animate-in' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Book Property <span className="text-primary">Appraisal</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Get a professional property valuation from our expert agents. Schedule a convenient time for a comprehensive assessment of your property's market value.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Benefits */}
          <div className="lg:col-span-1">
            <div className="bg-dark-lighter rounded-2xl p-6 border border-gray-700 sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-white">Why Get an Appraisal?</h3>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-white">{benefit.title}</h4>
                        <p className="text-sm text-gray-400">{benefit.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-dark-lighter rounded-2xl p-8 border border-gray-700">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((s) => (
                  <React.Fragment key={s}>
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          step >= s
                            ? 'bg-primary text-black'
                            : 'bg-dark border-2 border-gray-600 text-gray-400'
                        }`}
                      >
                        {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                      </div>
                      {s < 3 && (
                        <div
                          className={`w-16 h-1 mx-2 ${
                            step > s ? 'bg-primary' : 'bg-gray-600'
                          }`}
                        />
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <div className="mb-6">
                <h3 className="text-lg text-gray-400 mb-2">
                  Step {step} of 3: {step === 1 ? 'Select Date & Time' : step === 2 ? 'Choose Agent' : 'Property Details'}
                </h3>
              </div>

              {/* Step 1: Date & Time */}
              {step === 1 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-white">Select Date</h3>

                  {/* Calendar */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => {
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                          )
                        }}
                        className="p-2 hover:bg-dark rounded-lg transition-colors text-gray-400 hover:text-primary"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <h4 className="text-xl font-semibold text-white">
                        {currentMonth.toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </h4>
                      <button
                        onClick={() => {
                          setCurrentMonth(
                            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                          )
                        }}
                        className="p-2 hover:bg-dark rounded-lg transition-colors text-gray-400 hover:text-primary"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                        <div key={day} className="text-center text-sm text-gray-400 font-semibold py-2">
                          {day}
                        </div>
                      ))}
                      {days.map((date, idx) => (
                        <button
                          key={idx}
                          onClick={() => date && handleDateSelect(date)}
                          disabled={!date || isPastDate(date)}
                          className={`aspect-square rounded-lg transition-all font-medium ${
                            !date
                              ? ''
                              : isPastDate(date)
                              ? 'text-gray-600 cursor-not-allowed'
                              : selectedDate &&
                                date.getDate() === selectedDate.getDate() &&
                                date.getMonth() === selectedDate.getMonth() &&
                                date.getFullYear() === selectedDate.getFullYear()
                              ? 'bg-primary text-black font-bold'
                              : 'bg-dark border border-gray-700 hover:border-primary text-gray-300 hover:text-primary'
                          }`}
                        >
                          {date?.getDate()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Select Time</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 px-4 rounded-lg font-medium transition-all ${
                            selectedTime === time
                              ? 'bg-primary text-black font-bold'
                              : 'bg-dark border border-gray-700 text-gray-300 hover:border-primary hover:text-primary'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => selectedDate && selectedTime && setStep(2)}
                      disabled={!selectedDate || !selectedTime}
                      className="px-8 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Agent Selection */}
              {step === 2 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-white">Choose Your Agent</h3>

                  <div className="space-y-4">
                    {/* Both Agents Option */}
                    <button
                      onClick={() => setSelectedAgent('both')}
                      className={`w-full bg-dark-lighter rounded-xl p-6 border-2 transition-all text-left ${
                        selectedAgent === 'both'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full border-2 border-primary overflow-hidden">
                            <img
                              src={agents[0].image1}
                              alt="Agent 1"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full border-2 border-dark overflow-hidden">
                            <img
                              src={agents[0].image2}
                              alt="Agent 2"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold mb-1 text-white">{agents[0].name}</h4>
                          <p className="text-gray-400 mb-2">{agents[0].description}</p>
                          {selectedAgent === 'both' && (
                            <div className="flex items-center gap-2 text-primary">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-semibold">Recommended - Fastest Availability</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Separator */}
                    <div className="flex items-center gap-4 my-6">
                      <div className="flex-1 h-px bg-gray-700" />
                      <span className="text-gray-400 text-sm">Or choose a specific agent</span>
                      <div className="flex-1 h-px bg-gray-700" />
                    </div>

                    {/* Individual Agents */}
                    {agents.slice(1).map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => setSelectedAgent(agent.id)}
                        className={`w-full bg-dark-lighter rounded-xl p-6 border-2 transition-all text-left ${
                          selectedAgent === agent.id
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-700 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={agent.image}
                            alt={agent.name}
                            className="w-16 h-16 rounded-full border-2 border-primary/30 object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-xl font-bold mb-1 text-white">{agent.name}</h4>
                            <p className="text-gray-400 mb-2">{agent.specialty}</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-primary fill-primary" />
                              <span className="text-primary font-semibold">{agent.rating} Rating</span>
                            </div>
                          </div>
                          {selectedAgent === agent.id && (
                            <CheckCircle className="w-6 h-6 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-dark border-2 border-gray-700 text-primary font-semibold rounded-lg hover:border-primary transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-8 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Property Details */}
              {step === 3 && (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-2xl font-bold mb-6 text-white">Property Details</h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                          placeholder="John"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        Property Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="123 Main Street, City, State, ZIP"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        Property Type
                      </label>
                      <div className="relative">
                        <select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors appearance-none pr-10"
                        >
                          <option value="">Select Property Type</option>
                          {propertyTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors resize-none"
                        placeholder="Any specific details about your property..."
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-dark border-2 border-gray-700 text-primary font-semibold rounded-lg hover:border-primary transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2"
                    >
                      Book Appraisal
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Booking
