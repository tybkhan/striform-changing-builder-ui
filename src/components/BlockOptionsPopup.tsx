import React from 'react'
import { FormQuestion } from '../types'
import { Type, AlignLeft, Hash, List, CheckSquare, Calendar, Mail } from 'lucide-react'

interface BlockOptionsPopupProps {
  position: { top: number; left: number }
  onClose: () => void
  onSelectBlock: (type: FormQuestion['type']) => void
}

const BlockOptionsPopup: React.FC<BlockOptionsPopupProps> = ({ position, onClose, onSelectBlock }) => {
  const blockOptions = [
    { type: 'text', label: 'Short Text', icon: Type },
    { type: 'longText', label: 'Long Text', icon: AlignLeft },
    { type: 'number', label: 'Number', icon: Hash },
    { type: 'multipleChoice', label: 'Multiple Choice', icon: List },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { type: 'date', label: 'Date', icon: Calendar },
    { type: 'email', label: 'Email', icon: Mail },
  ]

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-4 w-64"
        style={{ position: 'absolute', top: position.top, left: position.left }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2">Add Block</h3>
        <div className="space-y-2">
          {blockOptions.map((option) => (
            <button
              key={option.type}
              className="w-full p-2 flex items-center text-left hover:bg-gray-100 rounded transition-colors duration-200"
              onClick={() => onSelectBlock(option.type as FormQuestion['type'])}
            >
              <option.icon size={18} className="mr-2" />
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlockOptionsPopup