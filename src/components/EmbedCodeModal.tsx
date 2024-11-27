import React, { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'

interface EmbedCodeModalProps {
  formId: string
  onClose: () => void
}

const EmbedCodeModal: React.FC<EmbedCodeModalProps> = ({ formId, onClose }) => {
  const [copied, setCopied] = useState(false)
  const [width, setWidth] = useState(600)
  const [height, setHeight] = useState(500)

  const embedCode = `<iframe src="${window.location.origin}/form/${formId}" width="${width}" height="${height}" frameborder="0"></iframe>`

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Embed Form</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (px)
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (px)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Embed Code
          </label>
          <textarea
            value={embedCode}
            readOnly
            className="w-full p-2 border border-gray-300 rounded h-24 font-mono text-sm"
          />
        </div>
        <button
          onClick={handleCopy}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center"
        >
          {copied ? (
            <>
              <Check size={20} className="mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={20} className="mr-2" />
              Copy Embed Code
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default EmbedCodeModal