import React from 'react'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '')

const PricingPage: React.FC = () => {
  const features = [
    { name: 'Unlimited Forms', free: true, pro: true },
    { name: 'Unlimited Responses', free: true, pro: true },
    { name: 'Unlimited Questions per Form', free: true, pro: true },
    { name: 'Add Images to Forms', free: true, pro: true },
    { name: 'Custom Colors and Fonts', free: true, pro: true },
    { name: 'Logic Builder', free: true, pro: true },
    { name: 'Score & Calculations', free: true, pro: true },
    { name: 'Hidden Fields', free: true, pro: true },
    { name: 'Embed Forms', free: true, pro: true },
    { name: 'Google Sheets Integration', free: true, pro: true },
    { name: 'Slack Integration', free: true, pro: true },
    { name: 'Zapier Integration', free: true, pro: true },
    { name: 'Email Notifications to Self', free: true, pro: true },
    { name: 'Multiple Endings per Form', free: true, pro: true },
    { name: 'Webhooks', free: true, pro: true },
    { name: 'Collect Signatures', free: true, pro: true },
    { name: 'Calendly Integration', free: true, pro: true },
    { name: 'Cal.com Integration', free: true, pro: true },
    { name: 'SavvyCal Integration', free: true, pro: true },
    { name: 'Redirect to a URL', free: false, pro: true },
    { name: 'Add Your Brand Logo', free: false, pro: true },
    { name: 'Customize Form Meta Data', free: false, pro: true },
    { name: 'Remove Striform Branding', free: false, pro: true },
    { name: 'Partial Submissions', free: false, pro: true },
    { name: 'Refill Link', free: false, pro: true },
    { name: 'Custom Domains', free: false, pro: true },
    { name: 'File Uploads (Unlimited Size)', free: false, pro: true },
    { name: 'Collect Payments', free: false, pro: true },
  ]

  const handleUpgrade = async () => {
    const stripe = await stripePromise
    if (!stripe) return

    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: import.meta.env.VITE_STRIPE_PRICE_ID,
      }),
    })

    const session = await response.json()
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    })

    if (result.error) {
      console.error(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">Free</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">$0</span>
                <span className="ml-1 text-xl font-semibold">/forever</span>
              </p>
              <p className="mt-6 text-gray-500">Perfect for individuals and small teams getting started with online forms.</p>

              <ul className="mt-6 space-y-6">
                {features.map((feature, index) => (
                  <li key={index} className="flex">
                    {feature.free ? (
                      <Check className="flex-shrink-0 w-6 h-6 text-green-500" />
                    ) : (
                      <X className="flex-shrink-0 w-6 h-6 text-red-500" />
                    )}
                    <span className="ml-3 text-gray-500">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/signup"
              className="mt-8 block w-full bg-purple-600 border border-transparent rounded-md py-3 px-6 text-center font-medium text-white hover:bg-purple-700"
            >
              Create Free Account
            </Link>
          </div>

          <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">$199</span>
                <span className="ml-1 text-xl font-semibold">one-time</span>
              </p>
              <p className="mt-6 text-gray-500">All the power you need for advanced form creation and data collection.</p>

              <ul className="mt-6 space-y-6">
                {features.map((feature, index) => (
                  <li key={index} className="flex">
                    <Check className="flex-shrink-0 w-6 h-6 text-green-500" />
                    <span className="ml-3 text-gray-500">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleUpgrade}
              className="mt-8 block w-full bg-purple-600 border border-transparent rounded-md py-3 px-6 text-center font-medium text-white hover:bg-purple-700"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-extrabold text-gray-900">
            Frequently Asked Questions
          </h3>
          <dl className="mt-8 space-y-6 text-left">
            <div>
              <dt className="text-lg font-medium text-gray-900">Is there really no catch with the free plan?</dt>
              <dd className="mt-2 text-base text-gray-500">
                No catch! Our free plan offers unlimited forms, responses, and questions. We believe in providing value first.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-medium text-gray-900">What do I get with the Pro plan?</dt>
              <dd className="mt-2 text-base text-gray-500">
                The Pro plan includes everything in the free plan, plus advanced features like custom branding, file uploads, payment collection, and more.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-medium text-gray-900">Is the $199 really a one-time payment?</dt>
              <dd className="mt-2 text-base text-gray-500">
                Yes! Pay once and enjoy all Pro features for life. No recurring fees or hidden charges.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default PricingPage