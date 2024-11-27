import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Form } from '../types'

interface EmailSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  form: Form
  onUpdate: (form: Form) => void
}

const EmailSettingsModal: React.FC<EmailSettingsModalProps> = ({
  isOpen,
  onClose,
  form,
  onUpdate
}) => {
  const [settings, setSettings] = useState({
    enabled: form.emailNotifications?.enabled || false,
    email: form.emailNotifications?.email || '',
    subject: form.emailNotifications?.subject || 'New Form Submission - {formTitle}',
    template: form.emailNotifications?.template || `
Dear form owner,

You have received a new submission for your form "{formTitle}".

Form Responses:
{responses}

Best regards,
Striform Team
    `.trim(),
    ccEmails: form.emailNotifications?.ccEmails || [],
    sendCopy: form.emailNotifications?.sendCopy || false,
    replyTo: form.emailNotifications?.replyTo || ''
  })

  const handleSave = () => {
    onUpdate({
      ...form,
      emailNotifications: settings
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Email Notification Settings</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Enable/Disable Notifications */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable Email Notifications
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {settings.enabled && (
              <>
                {/* Primary Notification Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Notification Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="your@email.com"
                  />
                </div>

                {/* CC Emails */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CC Emails (one per line)
                  </label>
                  <textarea
                    value={settings.ccEmails.join('\n')}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      ccEmails: e.target.value.split('\n').filter(email => email.trim())
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="cc1@email.com&#10;cc2@email.com"
                  />
                </div>

                {/* Reply-To Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reply-To Email
                  </label>
                  <input
                    type="email"
                    value={settings.replyTo}
                    onChange={(e) => setSettings({ ...settings, replyTo: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="replies@yourdomain.com"
                  />
                </div>

                {/* Email Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={settings.subject}
                    onChange={(e) => setSettings({ ...settings, subject: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="New Form Submission - {formTitle}"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Available variables: {'{formTitle}'}, {'{submissionDate}'}
                  </p>
                </div>

                {/* Email Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Template
                  </label>
                  <textarea
                    value={settings.template}
                    onChange={(e) => setSettings({ ...settings, template: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
                    rows={10}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Available variables: {'{formTitle}'}, {'{responses}'}, {'{submissionDate}'}
                  </p>
                </div>

                {/* Send Copy to Submitter */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.sendCopy}
                    onChange={(e) => setSettings({ ...settings, sendCopy: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Send confirmation email to form submitter (if email field is present)
                  </label>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailSettingsModal