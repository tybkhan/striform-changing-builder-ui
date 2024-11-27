import React from 'react'
import { X } from 'lucide-react'
import { Form } from '../types'
import ResponseMediaPreview from './ResponseMediaPreview'

interface ResponseDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  response: any
  form: Form
}

const ResponseDetailsModal: React.FC<ResponseDetailsModalProps> = ({
  isOpen,
  onClose,
  response,
  form
}) => {
  if (!isOpen) return null

  const formatAnswer = (question: any, answer: any): React.ReactNode => {
    if (!answer) return '-'

    if (question.type === 'signature' || question.type === 'fileUpload') {
      return <ResponseMediaPreview type={question.type} url={answer} />
    }

    if (typeof answer === 'object') {
      return JSON.stringify(answer)
    }

    return String(answer)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Response Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Submitted on {new Date(response.submitted_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {form.questions.map((question) => (
              <div
                key={question.id}
                className="bg-gray-50 rounded-lg p-4 transition-all duration-200 hover:bg-gray-100"
              >
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  {question.question}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                <div className="text-gray-900">
                  {formatAnswer(question, response.answers?.[question.id])}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                Status: {' '}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  response.is_partial
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {response.is_partial ? 'Partial' : 'Complete'}
                </span>
              </div>
              <div>
                Response ID: {response.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponseDetailsModal