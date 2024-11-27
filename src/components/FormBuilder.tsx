import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, FormQuestion } from '../types'
import { PlusCircle, Save, ArrowLeft, Mail, Layout } from 'lucide-react'
import QuestionBlock from './QuestionBlock'
import FormViewer from './FormViewer'
import CustomizationPanel from './CustomizationPanel'
import QuestionTypePopup from './QuestionTypePopup'
import EmailSettingsModal from './EmailSettingsModal'
import SaveConfirmationModal from './SaveConfirmationModal'
import FormThemes from './FormThemes'
import Toast from './Toast'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import debounce from 'lodash.debounce'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface FormBuilderProps {
  forms: Form[]
  onUpdateForm: (form: Form) => void
  onCreateForm: () => Form
  user: { isPro: boolean }
}

const FormBuilder: React.FC<FormBuilderProps> = ({ forms, onUpdateForm, onCreateForm, user }) => {
  const { formId } = useParams<{ formId: string }>()
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const [form, setForm] = useState<Form | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<FormQuestion | null>(null)
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0)
  const [showQuestionTypePopup, setShowQuestionTypePopup] = useState(false)
  const [showEmailSettings, setShowEmailSettings] = useState(false)
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)
  const [showThemes, setShowThemes] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (formData: Form) => {
      try {
        const { error } = await supabase
          .from('forms')
          .update({
            title: formData.title,
            description: formData.description,
            questions: formData.questions,
            updated_at: new Date().toISOString(),
            title_color: formData.titleColor,
            question_color: formData.questionColor,
            description_color: formData.descriptionColor,
            submit_button_color: formData.submitButtonColor,
            background_color: formData.backgroundColor,
            text_align: formData.textAlign,
            button_text: formData.buttonText,
            redirect_url: formData.redirectUrl,
            email_notifications_enabled: formData.emailNotifications?.enabled,
            email_notifications_address: formData.emailNotifications?.email
          })
          .eq('id', formData.id)
          .eq('user_id', authUser?.id)

        if (error) throw error
        
        onUpdateForm(formData)
        setToast({ message: 'Changes saved', type: 'success' })
      } catch (error) {
        console.error('Error saving form:', error)
        setToast({ message: 'Failed to save changes', type: 'error' })
      }
    }, 1000),
    [authUser]
  )

  useEffect(() => {
    const loadForm = async () => {
      setIsLoading(true)
      try {
        if (!authUser) {
          throw new Error('Not authenticated')
        }

        const { data, error } = await supabase
          .from('forms')
          .select('*')
          .eq('id', formId)
          .eq('user_id', authUser.id)
          .single()

        if (error) throw error
        if (!data) throw new Error('Form not found')

        // Convert the stored form data to match your Form type
        const loadedForm: Form = {
          ...data,
          questions: data.questions || [],
          titleColor: data.title_color,
          questionColor: data.question_color,
          descriptionColor: data.description_color,
          submitButtonColor: data.submit_button_color,
          backgroundColor: data.background_color,
          textAlign: data.text_align,
          buttonText: data.button_text,
          redirectUrl: data.redirect_url,
          emailNotifications: {
            enabled: data.email_notifications_enabled,
            email: data.email_notifications_address
          }
        }

        setForm(loadedForm)
        if (loadedForm.questions.length > 0) {
          setSelectedQuestion(loadedForm.questions[0])
          setSelectedQuestionIndex(0)
        }
      } catch (error) {
        console.error('Error loading form:', error)
        setToast({
          message: 'Failed to load form. Redirecting to dashboard...',
          type: 'error'
        })
        setTimeout(() => navigate('/dashboard'), 2000)
      } finally {
        setIsLoading(false)
      }
    }

    if (formId && authUser) {
      loadForm()
    }
  }, [formId, navigate, authUser])

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [debouncedSave])

  const handleFormUpdate = (updatedForm: Form) => {
    setForm(updatedForm)
    debouncedSave(updatedForm)
  }

  const handleThemeApply = (theme: any) => {
    if (!form) return

    const updatedForm = {
      ...form,
      titleColor: theme.colors.titleColor,
      questionColor: theme.colors.questionColor,
      descriptionColor: theme.colors.descriptionColor,
      submitButtonColor: theme.colors.submitButtonColor,
      backgroundColor: theme.colors.backgroundColor,
      textAlign: theme.layout === 'center' ? 'center' : 'left'
    }

    handleFormUpdate(updatedForm)
    setShowThemes(false)
    setToast({ message: 'Theme applied successfully', type: 'success' })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return
    const updatedForm = { ...form, title: e.target.value }
    handleFormUpdate(updatedForm)
  }

  const addQuestion = (newQuestion: FormQuestion) => {
    if (!form) return
    const updatedForm = { ...form, questions: [...form.questions, newQuestion] }
    handleFormUpdate(updatedForm)
    setSelectedQuestion(newQuestion)
    setSelectedQuestionIndex(form.questions.length)
  }

  const updateQuestion = (updatedQuestion: FormQuestion) => {
    if (!form) return
    const updatedQuestions = form.questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    )
    const updatedForm = { ...form, questions: updatedQuestions }
    handleFormUpdate(updatedForm)
  }

  const removeQuestion = (questionId: string) => {
    if (!form) return
    const updatedQuestions = form.questions.filter(q => q.id !== questionId)
    const updatedForm = { ...form, questions: updatedQuestions }
    handleFormUpdate(updatedForm)
    
    // Update selected question after removal
    if (selectedQuestion?.id === questionId) {
      const newIndex = Math.min(selectedQuestionIndex, updatedQuestions.length - 1)
      setSelectedQuestion(updatedQuestions[newIndex] || null)
      setSelectedQuestionIndex(newIndex)
    }
  }

  const handleQuestionSelect = (question: FormQuestion, index: number) => {
    setSelectedQuestion(question)
    setSelectedQuestionIndex(index)
  }

  const handleSave = async () => {
    if (!form || isSaving) return
    setIsSaving(true)

    try {
      const { error } = await supabase
        .from('forms')
        .update({
          title: form.title,
          description: form.description,
          questions: form.questions,
          updated_at: new Date().toISOString(),
          title_color: form.titleColor,
          question_color: form.questionColor,
          description_color: form.descriptionColor,
          submit_button_color: form.submitButtonColor,
          background_color: form.backgroundColor,
          text_align: form.textAlign,
          button_text: form.buttonText,
          redirect_url: form.redirectUrl,
          email_notifications_enabled: form.emailNotifications?.enabled,
          email_notifications_address: form.emailNotifications?.email
        })
        .eq('id', form.id)
        .eq('user_id', authUser?.id)

      if (error) throw error

      setToast({ message: 'Form saved successfully', type: 'success' })
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving form:', error)
      setToast({ message: 'Failed to save form', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!form) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col h-screen">
        <div className="bg-white shadow-md p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowThemes(true)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors duration-300 flex items-center"
              >
                <Layout size={20} className="mr-2" />
                Themes
              </button>
              <button
                onClick={() => setShowEmailSettings(true)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors duration-300 flex items-center"
              >
                <Mail size={20} className="mr-2" />
                Email Settings
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300 flex items-center disabled:opacity-50"
              >
                <Save size={20} className="mr-2" />
                {isSaving ? 'Saving...' : 'Save & Exit'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow flex overflow-hidden">
          {/* Questions Panel */}
          <div className="w-1/4 p-4 overflow-y-auto bg-white shadow-md">
            <input
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              className="w-full text-2xl font-bold mb-6 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Form Title"
            />
            <DragDropContext onDragEnd={() => {}}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {form.questions.map((question, index) => (
                      <Draggable key={question.id} draggableId={question.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleQuestionSelect(question, index)}
                            className={`mb-4 ${selectedQuestion?.id === question.id ? 'ring-2 ring-purple-500' : ''}`}
                          >
                            <QuestionBlock
                              question={question}
                              onUpdate={updateQuestion}
                              onRemove={() => removeQuestion(question.id)}
                              onAddBlock={() => setShowQuestionTypePopup(true)}
                              isPro={user?.isPro}
                              allQuestions={form.questions}
                              onVisibilityChange={() => {}}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <button
              onClick={() => setShowQuestionTypePopup(true)}
              className="w-full mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors duration-300 flex items-center justify-center"
            >
              <PlusCircle size={20} className="mr-2" />
              Add Question
            </button>
          </div>

          {/* Form Preview */}
          <div className="w-1/2 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
              <FormViewer 
                form={form} 
                isPreview={true} 
                currentQuestionIndex={selectedQuestionIndex}
              />
            </div>
          </div>

          {/* Customization Panel */}
          <div className="w-1/4 p-4 overflow-y-auto bg-white shadow-md">
            <CustomizationPanel
              form={form}
              selectedQuestion={selectedQuestion}
              onUpdateForm={handleFormUpdate}
              onUpdateQuestion={updateQuestion}
              user={user}
            />
          </div>
        </div>
      </div>

      {showQuestionTypePopup && (
        <QuestionTypePopup
          onClose={() => setShowQuestionTypePopup(false)}
          onAddQuestion={addQuestion}
        />
      )}

      {showThemes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <FormThemes
              onApplyTheme={handleThemeApply}
              currentTheme={{
                colors: {
                  titleColor: form.titleColor || '#1F2937',
                  questionColor: form.questionColor || '#374151',
                  descriptionColor: form.descriptionColor || '#6B7280',
                  submitButtonColor: form.submitButtonColor || '#6366F1',
                  backgroundColor: form.backgroundColor || 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                  accentColor: '#818CF8'
                }
              }}
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowThemes(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showEmailSettings && (
        <EmailSettingsModal
          isOpen={showEmailSettings}
          onClose={() => setShowEmailSettings(false)}
          form={form}
          onUpdate={handleFormUpdate}
        />
      )}

      {showSaveConfirmation && (
        <SaveConfirmationModal
          isOpen={showSaveConfirmation}
          onClose={() => setShowSaveConfirmation(false)}
          onConfirm={handleSave}
        />
      )}

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

export default FormBuilder