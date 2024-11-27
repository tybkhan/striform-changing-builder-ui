import React, { useState } from 'react'
import { X, Mail, Link as LinkIcon } from 'lucide-react'

interface SaveProgressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (email: string) => Promise<string>
}

const SaveProgressModal: React.FC<SaveProgressModalProps> = ({ isOpen, onClose, onSave }) => {
  const [email, setEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [resumeLink, setResumeLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const link = await onSave(email)
      setResumeLink(link)
    } catch (err) {
      setError('Failed to save progress. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyLink = () => {
    if (resumeLink) {
      navigator.clipboard.writeText(resumeLink)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Save Your Progress</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {!resumeLink ? (
          <>
            <p className="text-gray-600 mb-4">
              Enter your email address to save your progress. We'll send you a link to continue later.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                  placeholder="you@example.com"
                />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Progress'}
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md">
              <p className="font-medium">Progress Saved!</p>
              <p className="text-sm mt-1">We've sent a resume link to your email.</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">You can also copy the resume link:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={resumeLink}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 text-purple-600 hover:text-purple-700"
                  title="Copy Link"
                >
                  <LinkIcon size={20} />
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SaveProgressModal