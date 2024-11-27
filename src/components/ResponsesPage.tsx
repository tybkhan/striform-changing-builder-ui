import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, AlertCircle, Loader } from 'lucide-react'
import { Form } from '../types'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import ResponseMediaPreview from './ResponseMediaPreview'
import ResponseDetailsModal from './ResponseDetailsModal'

interface ResponsesPageProps {
  user: { isPro: boolean }
}

const ResponsesPage: React.FC<ResponsesPageProps> = ({ user }) => {
  const { formId } = useParams<{ formId: string }>()
  const { user: authUser } = useAuth()
  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [showPartial, setShowPartial] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: formData, error: formError } = await supabase
          .from('forms')
          .select('*')
          .eq('id', formId)
          .eq('user_id', authUser?.id)
          .single()

        if (formError) throw formError
        if (!formData) throw new Error('Form not found')

        const loadedForm: Form = {
          ...formData,
          questions: formData.questions || [],
          titleColor: formData.title_color,
          questionColor: formData.question_color,
          descriptionColor: formData.description_color,
          submitButtonColor: formData.submit_button_color,
          backgroundColor: formData.background_color,
          textAlign: formData.text_align,
          buttonText: formData.button_text,
          redirectUrl: formData.redirect_url,
          emailNotifications: {
            enabled: formData.email_notifications_enabled,
            email: formData.email_notifications_address
          }
        }
        setForm(loadedForm)

        const { data: responsesData, error: responsesError } = await supabase
          .from('responses')
          .select('*')
          .eq('form_id', formId)
          .order('submitted_at', { ascending: false })

        if (responsesError) throw responsesError
        setResponses(responsesData || [])
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load form data')
      } finally {
        setLoading(false)
      }
    }

    if (formId && authUser) {
      loadData()
    }
  }, [formId, authUser])

  const formatAnswer = (question: any, answer: any): React.ReactNode => {
    if (!answer) return '-'

    if (question.type === 'signature') {
      return <ResponseMediaPreview type="image/png" url={answer} />
    }

    if (question.type === 'fileUpload' && Array.isArray(answer)) {
      return (
        <div className="space-y-2">
          {answer.map((file: any, index: number) => (
            <ResponseMediaPreview
              key={index}
              type={file.type}
              url={file.url}
              fileName={file.name}
            />
          ))}
        </div>
      )
    }

    if (typeof answer === 'object') {
      return JSON.stringify(answer)
    }

    return String(answer)
  }

  const handleExportCSV = () => {
    if (!form || !responses.length) return

    const headers = ['Submission Date', 'Status', ...form.questions.map(q => q.question)]
    const csvData = responses.map(response => {
      const row = [
        new Date(response.submitted_at).toLocaleString(),
        response.is_partial ? 'Partial' : 'Complete'
      ]

      form.questions.forEach(question => {
        const answerData = response.answers[question.id]
        let formattedAnswer = ''
        
        if (question.type === 'signature' || question.type === 'fileUpload') {
          formattedAnswer = '[Media Content]'
        } else if (answerData) {
          formattedAnswer = typeof answerData === 'object' 
            ? JSON.stringify(answerData) 
            : String(answerData)
        }
        
        row.push(formattedAnswer)
      })

      return row
    })

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.title}_responses.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The form you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-purple-600 hover:text-purple-800 mr-4">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Responses for {form.title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user.isPro && (
              <div className="flex items-center">
                <label htmlFor="showPartial" className="mr-2 text-sm font-medium text-gray-700">
                  Show Partial Submissions
                </label>
                <input
                  type="checkbox"
                  id="showPartial"
                  checked={showPartial}
                  onChange={(e) => setShowPartial(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded"
                />
              </div>
            )}
            <button
              onClick={handleExportCSV}
              disabled={!responses.length}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {responses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Responses Yet</h2>
            <p className="text-gray-600">This form hasn't received any responses.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {form.questions.map((question) => (
                      <th key={question.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {question.question}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responses
                    .filter(response => showPartial || !response.is_partial)
                    .map((response) => (
                      <tr 
                        key={response.id}
                        onClick={() => setSelectedResponse(response)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(response.submitted_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            response.is_partial 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {response.is_partial ? 'Partial' : 'Complete'}
                          </span>
                        </td>
                        {form.questions.map((question) => (
                          <td key={question.id} className="px-6 py-4 text-sm text-gray-900">
                            {formatAnswer(question, response.answers?.[question.id])}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedResponse && form && (
        <ResponseDetailsModal
          isOpen={!!selectedResponse}
          onClose={() => setSelectedResponse(null)}
          response={selectedResponse}
          form={form}
        />
      )}
    </div>
  )
}

export default ResponsesPage