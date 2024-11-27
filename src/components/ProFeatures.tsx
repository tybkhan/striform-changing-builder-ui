import React, { useState } from 'react'
import { Form } from '../types'
import { Upload, Globe, DollarSign, Mail } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

interface ProFeaturesProps {
  form: Form
  onUpdateForm: (form: Form) => void
  user: { isPro: boolean }
}

const ProFeatures: React.FC<ProFeaturesProps> = ({ form, onUpdateForm, user }) => {
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [customDomain, setCustomDomain] = useState(form.customDomain || '')
  const [notificationEmail, setNotificationEmail] = useState(
    form.emailNotifications?.recipients[0] || ''
  )

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpdateForm({
          ...form,
          branding: {
            ...form.branding,
            logo: reader.result as string,
          },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCustomDomain = (domain: string) => {
    setCustomDomain(domain)
    onUpdateForm({
      ...form,
      customDomain: domain,
    })
  }

  const handleEmailNotifications = (email: string) => {
    setNotificationEmail(email)
    onUpdateForm({
      ...form,
      emailNotifications: {
        enabled: true,
        recipients: [email],
      },
    })
  }

  const handleStripeConnect = async () => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
    if (!stripe) return

    // Redirect to Stripe Connect OAuth flow
    window.location.href = `${import.meta.env.VITE_API_URL}/api/stripe/connect`
  }

  if (!user.isPro) {
    return (
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
        <p className="text-purple-700">
          Upgrade to Pro to access advanced features like custom branding, domains, and payment collection.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Pro Features</h3>
        
        {/* Brand Logo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Brand Logo</label>
          <div className="mt-1 flex items-center">
            {form.branding?.logo ? (
              <img
                src={form.branding.logo}
                alt="Brand logo"
                className="h-12 w-auto object-contain"
              />
            ) : (
              <div className="h-12 w-12 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center">
                <Upload className="text-gray-400" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="ml-4"
            />
          </div>
        </div>

        {/* Striform Branding */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={!form.branding?.showStriformBranding}
              onChange={(e) =>
                onUpdateForm({
                  ...form,
                  branding: {
                    ...form.branding,
                    showStriformBranding: !e.target.checked,
                  },
                })
              }
              className="form-checkbox h-4 w-4 text-purple-600"
            />
            <span className="ml-2 text-sm text-gray-700">Remove Striform Branding</span>
          </label>
        </div>

        {/* Custom Domain */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            <Globe className="inline-block mr-2" size={16} />
            Custom Domain
          </label>
          <div className="mt-1">
            <input
              type="text"
              value={customDomain}
              onChange={(e) => handleCustomDomain(e.target.value)}
              placeholder="forms.yourdomain.com"
              className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Add CNAME record pointing to forms.striform.com
          </p>
        </div>

        {/* Email Notifications */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            <Mail className="inline-block mr-2" size={16} />
            Email Notifications
          </label>
          <div className="mt-1">
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => handleEmailNotifications(e.target.value)}
              placeholder="your@email.com"
              className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Payment Collection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            <DollarSign className="inline-block mr-2" size={16} />
            Payment Collection
          </label>
          {form.paymentSettings?.stripeConnected ? (
            <div className="mt-2">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={form.paymentSettings.enabled}
                  onChange={(e) =>
                    onUpdateForm({
                      ...form,
                      paymentSettings: {
                        ...form.paymentSettings,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="form-checkbox h-4 w-4 text-purple-600"
                />
                <span className="ml-2 text-sm text-gray-700">Enable Payments</span>
              </label>
              {form.paymentSettings.enabled && (
                <div className="space-y-2">
                  <input
                    type="number"
                    value={form.paymentSettings.amount}
                    onChange={(e) =>
                      onUpdateForm({
                        ...form,
                        paymentSettings: {
                          ...form.paymentSettings,
                          amount: Number(e.target.value),
                        },
                      })
                    }
                    placeholder="Amount"
                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <select
                    value={form.paymentSettings.currency}
                    onChange={(e) =>
                      onUpdateForm({
                        ...form,
                        paymentSettings: {
                          ...form.paymentSettings,
                          currency: e.target.value,
                        },
                      })
                    }
                    className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleStripeConnect}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Connect Stripe Account
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProFeatures