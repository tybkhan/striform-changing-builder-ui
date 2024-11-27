import React, { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg animate-fade-in">
      <div
        className={`${
          type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        } flex items-center gap-2 pr-2`}
      >
        {type === 'success' ? (
          <CheckCircle size={16} />
        ) : (
          <XCircle size={16} />
        )}
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-75 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default Toast