'use client'

import React, { useState, useEffect } from 'react'
import AgentCard from '../../../../src/components/admin/AgentCard'
import AgentModal from '../../../../src/components/admin/AgentModal'
import DeleteConfirmModal from '../../../../src/components/admin/DeleteConfirmModal'

export default function AgentRegistration() {
  const [agents, setAgents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState(null)

  // Fetch agents from API (mock data for now)
  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchAgents = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        
        // Mock data - replace with actual API call
        const mockAgents = [
          {
            id: '1',
            name: 'Imran Chowdhury',
            role: 'Senior Real Estate Agent & Co-Founder',
            email: 'imran@eliteproperties.com',
            phone: '+1 (555) 123-4567',
            imageUrl: 'https://cdn6.ep.dynamics.net/s3/rw-media/memberphotos/b848290e-2702-4394-99c5-d56874cb0654.png?height=828&maxheight=2560&maxwidth=2560&quality=90&scale=both&width=828&format=webp',
            description: 'Imran is a dedicated and dynamic real estate agent...',
            education: 'MBA, Harvard Business School',
            specialties: ['Luxury Residential', 'Investment Properties', 'Waterfront Estates'],
            certifications: ['Certified Luxury Home Marketing Specialist', "Accredited Buyer's Representative"],
            achievements: ['Top 1% of agents nationwide', '$150M+ in career sales', '200+ satisfied clients'],
          },
          {
            id: '2',
            name: 'Rafsan Hasan',
            role: 'Senior Real Estate Agent & Co-Founder',
            email: 'rafsan@eliteproperties.com',
            phone: '+1 (555) 234-5678',
            imageUrl: 'https://cdn6.ep.dynamics.net/s3/rw-media/memberphotos/0cb305ee-6c8d-48c2-90c6-9023200ae177.jpg?height=828&maxheight=2560&maxwidth=2560&quality=90&scale=both&width=828&format=webp',
            description: 'Having helped over 30 families achieve their property dreams...',
            education: 'B.S. Finance, UC Berkeley',
            specialties: ['Commercial Real Estate', 'New Developments', 'Property Investment'],
            certifications: ['Certified Commercial Investment Member', 'Senior Real Estate Specialist'],
            achievements: ['Multi-million dollar deal closer', '$100M+ in career sales', '180+ successful transactions'],
          },
        ]
        
        setAgents(mockAgents)
      } catch (error) {
        console.error('Error fetching agents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  const handleCardClick = (agent = null) => {
    setSelectedAgent(agent)
    setIsModalOpen(true)
  }

  const handleSave = async (formData, isEditMode) => {
    try {
      // TODO: Replace with actual API call
      // For file upload, you would typically:
      // 1. Upload the image file to your backend/storage first
      // 2. Get the URL back
      // 3. Then save the agent with the image URL
      
      // Example API call structure:
      // let imageUrl = formData.imageUrl
      // if (formData.imageFile) {
      //   const uploadFormData = new FormData()
      //   uploadFormData.append('image', formData.imageFile)
      //   const imageResponse = await fetch('/api/upload', {
      //     method: 'POST',
      //     body: uploadFormData
      //   })
      //   const { url } = await imageResponse.json()
      //   imageUrl = url
      // }
      
      // TODO: In production, upload the file to your backend first
      // if (formData.imageFile) {
      //   const uploadFormData = new FormData()
      //   uploadFormData.append('image', formData.imageFile)
      //   const imageResponse = await fetch('/api/upload', {
      //     method: 'POST',
      //     body: uploadFormData
      //   })
      //   const { url } = await imageResponse.json()
      //   formData.imageUrl = url
      // }
      
      // For now, formData.imageUrl contains base64 data URL if file was selected
      // or the URL string if URL was entered
      const { imageFile, ...agentData } = formData // Remove imageFile from agent data
      
      if (isEditMode) {
        // Update existing agent
        const updatedAgents = agents.map((agent) =>
          agent.id === selectedAgent.id 
            ? { 
                ...agent, 
                ...agentData,
              } 
            : agent
        )
        setAgents(updatedAgents)
        console.log('Updating agent:', selectedAgent.id, agentData)
      } else {
        // Create new agent
        const newAgent = {
          id: Date.now().toString(),
          ...agentData,
        }
        setAgents([...agents, newAgent])
        console.log('Creating new agent:', agentData)
      }

      setIsModalOpen(false)
      setSelectedAgent(null)
      
      // TODO: Show success notification
      alert(isEditMode ? 'Agent updated successfully!' : 'Agent registered successfully!')
    } catch (error) {
      console.error('Error saving agent:', error)
      alert('Error saving agent. Please try again.')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAgent(null)
  }

  const handleDeleteClick = (agent) => {
    setAgentToDelete(agent)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/agents/${agentToDelete.id}`, { method: 'DELETE' })
      
      const updatedAgents = agents.filter((agent) => agent.id !== agentToDelete.id)
      setAgents(updatedAgents)
      
      setDeleteModalOpen(false)
      setAgentToDelete(null)
      
      // TODO: Show success notification
      alert('Agent deleted successfully!')
    } catch (error) {
      console.error('Error deleting agent:', error)
      alert('Error deleting agent. Please try again.')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setAgentToDelete(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Agent Management</h1>
          <p className="text-gray-400">Manage your real estate agents.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading agents...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Agent Management</h1>
        <p className="text-sm text-gray-400">Manage your real estate agents. Click on an agent card to edit or click the + card to add a new agent.</p>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Existing Agent Cards */}
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onClick={() => handleCardClick(agent)}
            onDelete={handleDeleteClick}
          />
        ))}

        {/* Add New Agent Card */}
        <AgentCard isNew onClick={() => handleCardClick(null)} />
      </div>

      {/* Empty State */}
      {agents.length === 0 && (
        <div className="bg-dark-lighter rounded-xl p-12 border border-primary/20 text-center">
          <p className="text-gray-400 mb-4">No agents registered yet.</p>
          <p className="text-sm text-gray-500">Click the + card above to register your first agent.</p>
        </div>
      )}

      {/* Agent Modal */}
      <AgentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        agent={selectedAgent}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={agentToDelete?.name || 'this agent'}
      />
    </div>
  )
}
