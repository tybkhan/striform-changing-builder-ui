import React from 'react'
import { PlusCircle, BarChart2 } from 'lucide-react'

interface DashboardHeaderProps {
  onCreateForm: () => void
  isCreating: boolean
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreateForm, isCreating }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <BarChart2 size={36} className="text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Striform</h1>
        </div>
        <button
          onClick={onCreateForm}
          disabled={isCreating}
          className={`px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300 flex items-center text-lg font-semibold shadow-md ${
            isCreating ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          <PlusCircle size={24} className="mr-2" />
          {isCreating ? 'Creating...' : 'Create New Form'}
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader