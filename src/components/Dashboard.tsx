import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form } from '../types'
import DashboardHeader from './DashboardHeader'
import FormCard from './FormCard'
import EmbedCodeModal from './EmbedCodeModal'
import ProUpgradeModal from './ProUpgradeModal'
import Toast from './Toast'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface DashboardProps {
  forms: Form[]
  onCreateForm: () => Form
  onDeleteForm: (formId: string) => void
  updateResponseCount: (formId: string) => void
}

const Dashboard: React.FC<DashboardProps> = ({ forms = [], onCreateForm, onDeleteForm, updateResponseCount }) => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [embedModalOpen, setEmbedModalOpen] = useState(false)
  const [proModalOpen, setProModalOpen] = useState(false)
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deletingForms, setDeletingForms] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [localForms, setLocalForms] = useState<Form[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchForms()
    }
  }, [isAuthenticated, user])

  const fetchForms = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('forms')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setLocalForms(data || [])
    } catch (err) {
      console.error('Error fetching forms:', err)
      setError('Failed to fetch forms. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateForm = async () => {
    if (isCreating || !user) return
    setIsCreating(true)

    try {
      const newForm = {
        title: 'Untitled Form',
        description: '',
        questions: [],
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        title_color: '#1F2937',
        question_color: '#374151',
        description_color: '#6B7280',
        submit_button_color: '#6366F1',
        background_color: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        text_align: 'left',
        button_text: 'Submit',
        redirect_url: '',
        email_notifications_enabled: false,
        email_notifications_address: ''
      }

      const { data, error } = await supabase
        .from('forms')
        .insert([newForm])
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('No data returned from form creation')

      navigate(`/builder/${data.id}`)
    } catch (error) {
      console.error('Error creating form:', error)
      setToast({ message: 'Failed to create form. Please try again.', type: 'error' })
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditForm = (formId: string) => {
    navigate(`/builder/${formId}`)
  }

  const handleDeleteForm = async (formId: string) => {
    setDeletingForms(prev => new Set(prev).add(formId))
    
    try {
      // First, delete all responses associated with the form
      const { error: responsesError } = await supabase
        .from('responses')
        .delete()
        .eq('form_id', formId)

      if (responsesError) throw responsesError

      // Then delete the form itself
      const { error: formError } = await supabase
        .from('forms')
        .delete()
        .eq('id', formId)
        .eq('user_id', user?.id)

      if (formError) throw formError

      setLocalForms(prevForms => prevForms.filter(form => form.id !== formId))
      onDeleteForm(formId)
      setToast({ message: 'Form deleted successfully', type: 'success' })
    } catch (error) {
      console.error('Error deleting form:', error)
      setToast({ message: 'Failed to delete form. Please try again.', type: 'error' })
    } finally {
      setDeletingForms(prev => {
        const next = new Set(prev)
        next.delete(formId)
        return next
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader onCreateForm={handleCreateForm} isCreating={isCreating} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {localForms.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow-md p-12">
            <p className="text-2xl text-gray-600 mb-6">You don't have any forms created yet.</p>
            <button
              onClick={handleCreateForm}
              disabled={isCreating}
              className="px-8 py-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
            >
              {isCreating ? 'Creating...' : 'Create Your First Form'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {localForms.map(form => (
              <FormCard
                key={form.id}
                form={form}
                onEdit={handleEditForm}
                onView={(id) => window.open(`/form/${id}`, '_blank')}
                onShare={(id) => {
                  const url = `${window.location.origin}/form/${id}`
                  setShareUrl(url)
                  navigator.clipboard.writeText(url)
                  setToast({ message: 'Form URL copied to clipboard', type: 'success' })
                }}
                onViewResponses={(id) => navigate(`/responses/${id}`)}
                onEmbed={(id) => {
                  setSelectedFormId(id)
                  setEmbedModalOpen(true)
                }}
                onIntegrations={(id) => navigate(`/integrations/${id}`)}
                onDelete={handleDeleteForm}
                isDeleting={deletingForms.has(form.id)}
              />
            ))}
          </div>
        )}
      </main>

      {embedModalOpen && selectedFormId && (
        <EmbedCodeModal
          formId={selectedFormId}
          onClose={() => setEmbedModalOpen(false)}
        />
      )}

      <ProUpgradeModal
        isOpen={proModalOpen}
        onClose={() => setProModalOpen(false)}
        onUpgrade={() => {}}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default Dashboard