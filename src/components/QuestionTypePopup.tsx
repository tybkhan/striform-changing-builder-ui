import React, { useState } from 'react'
import { FormQuestion } from '../types'
import { 
  Type, AlignLeft, Hash, List, CheckSquare, Calendar, Mail, 
  Edit, MessageSquare, Globe, CheckCircle, Upload, UserPlus 
} from 'lucide-react'

interface QuestionTypePopupProps {
  onClose: () => void
  onAddQuestion: (question: FormQuestion) => void
}

const QuestionTypePopup: React.FC<QuestionTypePopupProps> = ({ onClose, onAddQuestion }) => {
  const [selectedType, setSelectedType] = useState<FormQuestion['type']>('text')
  const [questionText, setQuestionText] = useState('')
  const [statementText, setStatementText] = useState('')

  const questionTypes = [
    { type: 'text', label: 'Short Text', icon: Type },
    { type: 'longText', label: 'Long Text', icon: AlignLeft },
    { type: 'number', label: 'Number', icon: Hash },
    { type: 'singleSelect', label: 'Single Select', icon: CheckCircle },
    { type: 'multipleChoice', label: 'Multiple Choice', icon: List },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { type: 'date', label: 'Date', icon: Calendar },
    { type: 'email', label: 'Email', icon: Mail },
    { type: 'signature', label: 'Signature', icon: Edit },
    { type: 'statement', label: 'Statement Block', icon: MessageSquare },
    { type: 'url', label: 'Website URL', icon: Globe },
    { type: 'fileUpload', label: 'File Upload', icon: Upload },
    { type: 'contactInfo', label: 'Contact Info', icon: UserPlus }
  ]

  const handleAddQuestion = () => {
    const newQuestion: FormQuestion = {
      id: Date.now().toString(),
      type: selectedType,
      question: questionText || 'New Question',
      statement: selectedType === 'statement' ? statementText : undefined,
      options: ['Option 1', 'Option 2', 'Option 3'],
      fileUploadConfig: selectedType === 'fileUpload' ? {
        maxFiles: 1,
        acceptedFileTypes: ['application/pdf', 'image/*'],
        maxFileSize: 5 * 1024 * 1024 // 5MB
      } : undefined,
      contactFields: selectedType === 'contactInfo' ? {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true
      } : undefined
    }
    onAddQuestion(newQuestion)
    onClose()
  }

  const renderPreview = () => {
    if (selectedType === 'contactInfo') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" disabled />
          </div>
        </div>
      )
    }

    switch (selectedType) {
      case 'text':
        return <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="Short answer text" disabled />
      case 'longText':
        return <textarea className="w-full p-2 border border-gray-300 rounded" rows={3} placeholder="Long answer text" disabled />
      case 'number':
        return <input type="number" className="w-full p-2 border border-gray-300 rounded" placeholder="0" disabled />
      case 'singleSelect':
      case 'multipleChoice':
        return (
          <div className="space-y-2">
            {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
              <div key={index} className="flex items-center">
                <input 
                  type={selectedType === 'singleSelect' ? 'radio' : 'radio'} 
                  className="mr-2" 
                  disabled 
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {['Option 1', 'Option 2', 'Option 3'].map((option, index) => (
              <div key={index} className="flex items-center">
                <input type="checkbox" className="mr-2" disabled />
                <span>{option}</span>
              </div>
            ))}
          </div>
        )
      case 'date':
        return <input type="date" className="w-full p-2 border border-gray-300 rounded" disabled />
      case 'email':
        return <input type="email" className="w-full p-2 border border-gray-300 rounded" placeholder="email@example.com" disabled />
      case 'signature':
        return (
          <div className="w-full h-32 border border-gray-300 rounded bg-white flex items-center justify-center text-gray-400">
            Signature Pad
          </div>
        )
      case 'statement':
        return (
          <div className="w-full p-4 bg-white border border-gray-300 rounded">
            <p className="text-gray-700">{statementText || 'Your statement will appear here'}</p>
          </div>
        )
      case 'url':
        return <input type="url" className="w-full p-2 border border-gray-300 rounded" placeholder="https://example.com" disabled />
      case 'fileUpload':
        return (
          <div className="w-full p-4 border border-gray-300 rounded bg-white flex items-center justify-center text-gray-400">
            <Upload size={24} className="mr-2" />
            <span>Click or drag file to upload</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Question</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Question Type</h3>
            <div className="space-y-2">
              {questionTypes.map((type) => (
                <button
                  key={type.type}
                  className={`w-full p-2 flex items-center text-left rounded transition-colors duration-200 ${
                    selectedType === type.type ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedType(type.type as FormQuestion['type'])}
                >
                  <type.icon size={18} className="mr-2" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              {selectedType === 'statement' ? (
                <textarea
                  value={statementText}
                  onChange={(e) => setStatementText(e.target.value)}
                  placeholder="Enter your statement"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                  rows={5}
                />
              ) : (
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter your question"
                  className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
              )}
              {renderPreview()}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAddQuestion}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionTypePopup