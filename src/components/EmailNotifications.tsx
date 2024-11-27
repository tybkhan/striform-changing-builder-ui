import React from 'react'
import { Form } from '../types'
import { Mail } from 'lucide-react'

interface EmailNotificationsProps {
  form: Form
  onUpdate: (form: Form) => void
}

const EmailNotifications: React.FC<EmailNotificationsProps> = ({ form, onUpdate }) => {
  const handleToggleNotifications = () => {
    onUpdate({
      ...form,
      emailNotifications: {
        enabled: !form.emailNotifications?.enabled,
        email: form.emailNotifications?.email || ''
      }
    })
  }

  const handleEmailChange = (email: string) => {
    onUpdate({
      ...form,
      emailNotifications: {
        enabled: form.emailNotifications?.enabled || false,
        email
      }
    })
  }

  return (
    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
        </div>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={form.emailNotifications?.enabled || false}
              onChange={handleToggleNotifications}
            />
            <div className="w-10 h-6 bg-gray-200 rounded-full shadow-inner"></div>
            <div className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out transform ${
              form.emailNotifications?.enabled ? 'translate-x-5' : 'translate-x-1'
            } top-1`}></div>
          </div>
        </label>
      </div>

      {form.emailNotifications?.enabled && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notification Email
            </label>
            <input
              type="email"
              value={form.emailNotifications?.email || ''}
              onChange={(e) => handleEmailChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              placeholder="Enter email address"
            />
          </div>
          <p className="text-sm text-gray-500">
            You'll receive an email notification whenever someone submits this form.
          </p>
        </div>
      )}
    </div>
  )
}

export default EmailNotifications