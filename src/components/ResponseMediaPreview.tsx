import React, { useState } from 'react'
import { FileText, Download, Eye, Image as ImageIcon, File, Loader } from 'lucide-react'

interface ResponseMediaPreviewProps {
  type: string
  url: string
  fileName?: string
}

const ResponseMediaPreview: React.FC<ResponseMediaPreviewProps> = ({ type, url, fileName }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const isImage = type.startsWith('image/') || url.startsWith('data:image/')
  const isSignature = url.startsWith('data:image/') && !fileName

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = fileName || 'download'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSignature) {
    return (
      <div className="relative group">
        <img
          src={url}
          alt="Signature"
          className="max-h-16 border border-gray-200 rounded bg-white p-1"
          onClick={() => setShowPreview(true)}
        />
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPreview(false)}>
            <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
              <img src={url} alt="Signature" className="max-w-full" />
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isImage) {
    return (
      <div className="relative group">
        <div className="w-16 h-16 border border-gray-200 rounded overflow-hidden bg-white">
          <img
            src={url}
            alt={fileName || 'Preview'}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowPreview(true)}
          />
        </div>
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPreview(false)}>
            <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
              <img src={url} alt={fileName || 'Preview'} className="max-w-full" />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
        <File size={20} className="text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
        >
          {isLoading ? (
            <Loader size={14} className="animate-spin mr-1" />
          ) : (
            <Download size={14} className="mr-1" />
          )}
          Download
        </button>
      </div>
    </div>
  )
}

export default ResponseMediaPreview