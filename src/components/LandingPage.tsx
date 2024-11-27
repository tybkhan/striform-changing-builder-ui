import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, MessageSquare, DollarSign, Zap, Shield, Users } from 'lucide-react'

const LandingPage: React.FC = () => {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
        }
      })
    }, observerOptions)

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl animate-fade-in">
          Welcome to <span className="text-purple-600">Striform</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 animate-fade-in animate-delay-300">
          The free alternative to Typeform with unlimited forms and responses
        </p>
        <div className="mt-10 animate-fade-in animate-delay-600">
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
          >
            Get Started for Free
            <MessageSquare className="ml-2 -mr-1 h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12 fade-in">
            Why Choose Striform?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 fade-in">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Create and deploy forms in minutes, not hours.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 fade-in">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Your data is protected with enterprise-grade security.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 fade-in">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unlimited Responses</h3>
              <p className="text-gray-600">Collect as many responses as you need, at no extra cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12 fade-in">
            Striform vs Typeform: The Smart Choice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden fade-in">
              <div className="bg-purple-600 text-white p-6">
                <h3 className="text-2xl font-bold">Striform</h3>
                <p className="text-3xl font-extrabold mt-2">$199</p>
                <p className="text-sm opacity-75">One-time payment for lifetime access</p>
              </div>
              <ul className="p-6 space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
                  <span className="ml-3 text-gray-700">Unlimited forms</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
                  <span className="ml-3 text-gray-700">Unlimited responses</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
                  <span className="ml-3 text-gray-700">All features included</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
                  <span className="ml-3 text-gray-700">No monthly fees</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden fade-in">
              <div className="bg-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-700">Typeform</h3>
                <p className="text-3xl font-extrabold mt-2 text-gray-900">$50/month</p>
                <p className="text-sm text-gray-600">Billed annually ($600/year)</p>
              </div>
              <ul className="p-6 space-y-4">
                <li className="flex items-start">
                  <DollarSign className="flex-shrink-0 h-6 w-6 text-red-500" />
                  <span className="ml-3 text-gray-700">Limited forms on lower plans</span>
                </li>
                <li className="flex items-start">
                  <DollarSign className="flex-shrink-0 h-6 w-6 text-red-500" />
                  <span className="ml-3 text-gray-700">Response limits on all plans</span>
                </li>
                <li className="flex items-start">
                  <DollarSign className="flex-shrink-0 h-6 w-6 text-red-500" />
                  <span className="ml-3 text-gray-700">Premium features locked behind higher tiers</span>
                </li>
                <li className="flex items-start">
                  <DollarSign className="flex-shrink-0 h-6 w-6 text-red-500" />
                  <span className="ml-3 text-gray-700">Ongoing monthly or annual fees</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center fade-in">
            <Link
              to="/pricing"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-purple-600 hover:text-purple-800 transition-colors duration-300"
            >
              See Full Features
            </Link>
          </div>
        </div>
      </section>

      {/* Cost Savings Calculator */}
      <section className="bg-purple-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 fade-in">
            See How Much You're Losing with Typeform
          </h2>
          <p className="text-xl text-gray-600 mb-8 fade-in">
            With Typeform, you'll spend $600 every year. In just 4 months of using Striform, you'll already start saving money!
          </p>
          <div className="bg-white rounded-xl shadow-lg p-8 fade-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your 5-Year Savings with Striform</h3>
            <p className="text-5xl font-extrabold text-purple-600">$2,801</p>
            <p className="text-gray-600 mt-2">That's how much you save compared to Typeform over 5 years!</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12 fade-in">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 fade-in">
              <p className="text-gray-600 mb-4">"Striform has revolutionized how we collect data. It's so easy to use and the unlimited responses are a game-changer!"</p>
              <p className="font-semibold">- Sarah J., Marketing Manager</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 fade-in">
              <p className="text-gray-600 mb-4">"I switched from Typeform and haven't looked back. Striform offers everything I need at a fraction of the cost."</p>
              <p className="font-semibold">- Mike T., Small Business Owner</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 fade-in">
              <p className="text-gray-600 mb-4">"The customer support is fantastic, and the platform is so intuitive. Striform has made form creation a breeze!"</p>
              <p className="font-semibold">- Emily R., UX Researcher</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 fade-in">
            Ready to Start Saving?
          </h2>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300 fade-in"
          >
            Get Started Now
            <CheckCircle className="ml-2 -mr-1 h-6 w-6" />
          </Link>
          <p className="mt-4 text-gray-600 fade-in">
            No credit card required. Start creating forms for free!
          </p>
        </div>
      </section>
    </div>
  )
}

export default LandingPage