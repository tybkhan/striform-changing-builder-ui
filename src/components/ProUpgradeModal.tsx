import React from 'react'
import { Check, X } from 'lucide-react'

interface ProUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: () => void
}

const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null

  const features = [
    'Custom Branding & White Label',
    'File Uploads (Unlimited Size)',
    'Custom Domains',
    'Partial Submissions Tracking',
    'Advanced Analytics',
    'Priority Support',
    'Custom Success Pages',
    'Custom Meta Data',
    'Refill Links',
    'Payment Collection',
    'Advanced Logic & Calculations',
    'Custom Webhooks',
    'Advanced Integrations',
    'Team Collaboration',
    'Custom CSS & JavaScript'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Purple gradient header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-t-2xl p-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-purple-200 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold mb-2">Upgrade to Pro</h2>
            <p className="text-purple-100 text-lg">One-time payment, lifetime access</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-5xl font-bold">$199</span>
              <span className="ml-2 text-purple-200">USD</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <h3 className="text-xl font-semibold mb-6">Everything in Free, plus:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                    <Check size={14} className="text-purple-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Value props */}
            <div className="bg-purple-50 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-purple-900 mb-4">Why upgrade to Pro?</h4>
              <ul className="space-y-3 text-purple-800">
                <li>• Save $401 compared to Typeform's annual plan</li>
                <li>• One-time payment, no recurring fees</li>
                <li>• Lifetime access to all Pro features</li>
                <li>• Free updates and new features</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onUpgrade}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
              >
                Upgrade Now
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300"
              >
                Maybe Later
              </button>
            </div>

            {/* Money back guarantee */}
            <p className="text-center text-gray-600 mt-6">
              30-day money-back guarantee • Secure payment
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProUpgradeModal