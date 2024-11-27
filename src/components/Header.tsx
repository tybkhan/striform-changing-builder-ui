import React from 'react'
import { Link } from 'react-router-dom'
import { BarChart2 } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <BarChart2 size={32} className="text-purple-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Striform</h1>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            </li>
            <li>
              <Link to="/signup" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300">
                Sign Up
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header