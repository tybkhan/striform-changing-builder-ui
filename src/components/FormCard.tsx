import React from 'react'
import { FileText, Edit, Share2, Eye, Code, Link, Trash2, Loader } from 'lucide-react'
import { Form } from '../types'

interface FormCardProps {
  form: Form
  onEdit: (formId: string) => void
  onView: (formId: string) => void
  onShare: (formId: string) => void
  onViewResponses: (formId: string) => void
  onEmbed: (formId: string) => void
  onIntegrations: (formId: string) => void
  onDelete: (formId: string) => void
  isDeleting: boolean
}

const FormCard: React.FC<FormCardProps> = ({
  form,
  onEdit,
  onView,
  onShare,
  onViewResponses,
  onEmbed,
  onIntegrations,
  onDelete,
  isDeleting,
}) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
      isDeleting ? 'opacity-50' : ''
    }`}>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3 truncate">{form.title}</h2>
        <p className="text-gray-600 mb-6">Responses: {form.responseCount}</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onEdit(form.id)}
            disabled={isDeleting}
            className="flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit size={18} className="mr-2" />
            Edit
          </button>
          <button
            onClick={() => onView(form.id)}
            disabled={isDeleting}
            className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={18} className="mr-2" />
            View
          </button>
          <button
            onClick={() => onShare(form.id)}
            disabled={isDeleting}
            className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 size={18} className="mr-2" />
            Share
          </button>
          <button
            onClick={() => onViewResponses(form.id)}
            disabled={isDeleting}
            className="flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye size={18} className="mr-2" />
            Responses
          </button>
          <button
            onClick={() => onEmbed(form.id)}
            disabled={isDeleting}
            className="flex items-center justify-center px-4 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Code size={18} className="mr-2" />
            Embed
          </button>
          <button
            onClick={() => onIntegrations(form.id)}
            disabled={isDeleting}
            className="flex items-center justify-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Link size={18} className="mr-2" />
            Integrations
          </button>
          <button
            onClick={() => onDelete(form.id)}
            disabled={isDeleting}
            className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed col-span-2"
          >
            {isDeleting ? (
              <Loader size={18} className="mr-2 animate-spin" />
            ) : (
              <Trash2 size={18} className="mr-2" />
            )}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormCard