import React from 'react'
import { Link } from 'react-router-dom'
import { BarChart2 } from 'lucide-react'

interface FormWatermarkProps {
  isPro?: boolean
}

const FormWatermark: React.FC<FormWatermarkProps> = ({ isPro = false }) => {
  if (isPro) return null

  return (
    <Link
      to="/"
      className="fixed bottom-4 left-4 flex items-center px-3 py-2 bg-black/80 hover:bg-black/90 text-white rounded-lg text-sm transition-all duration-300 backdrop-blur-sm group"
    >
      <BarChart2 size={16} className="mr-2 text-purple-400 group-hover:text-purple-300" />
      <span>Powered by <span className="font-semibold">Striform</span></span>
    </Link>
  )
}

export default FormWatermark