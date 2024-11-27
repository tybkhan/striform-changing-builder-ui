import React, { useState } from 'react'
import { Form } from '../types'
import { Palette, Plus, Edit2, Copy, Check, Trash2, Layout } from 'lucide-react'

interface Theme {
  id: string
  name: string
  layout: 'classic' | 'modern' | 'minimal' | 'gradient' | 'split'
  colors: {
    titleColor: string
    questionColor: string
    descriptionColor: string
    submitButtonColor: string
    backgroundColor: string
    accentColor: string
  }
  fonts: {
    titleFont: string
    bodyFont: string
  }
  spacing: {
    questionSpacing: string
    sectionSpacing: string
    contentPadding: string
  }
  isCustom?: boolean
}

interface FormThemesProps {
  onApplyTheme: (theme: Theme) => void
  currentTheme?: Partial<Theme>
}

const predefinedThemes: Theme[] = [
  {
    id: 'modern-purple',
    name: 'Modern Purple',
    layout: 'modern',
    colors: {
      titleColor: '#1F2937',
      questionColor: '#374151',
      descriptionColor: '#6B7280',
      submitButtonColor: '#6366F1',
      backgroundColor: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
      accentColor: '#818CF8'
    },
    fonts: {
      titleFont: 'Inter',
      bodyFont: 'Inter'
    },
    spacing: {
      questionSpacing: '2rem',
      sectionSpacing: '3rem',
      contentPadding: '2rem'
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    layout: 'gradient',
    colors: {
      titleColor: '#1E3A8A',
      questionColor: '#1E40AF',
      descriptionColor: '#3B82F6',
      submitButtonColor: '#2563EB',
      backgroundColor: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
      accentColor: '#60A5FA'
    },
    fonts: {
      titleFont: 'Inter',
      bodyFont: 'Inter'
    },
    spacing: {
      questionSpacing: '2.5rem',
      sectionSpacing: '3.5rem',
      contentPadding: '2.5rem'
    }
  },
  {
    id: 'forest-minimal',
    name: 'Forest Minimal',
    layout: 'minimal',
    colors: {
      titleColor: '#064E3B',
      questionColor: '#065F46',
      descriptionColor: '#059669',
      submitButtonColor: '#10B981',
      backgroundColor: '#ECFDF5',
      accentColor: '#34D399'
    },
    fonts: {
      titleFont: 'Inter',
      bodyFont: 'Inter'
    },
    spacing: {
      questionSpacing: '1.5rem',
      sectionSpacing: '2.5rem',
      contentPadding: '1.5rem'
    }
  },
  {
    id: 'sunset-split',
    name: 'Sunset Split',
    layout: 'split',
    colors: {
      titleColor: '#7C2D12',
      questionColor: '#9A3412',
      descriptionColor: '#C2410C',
      submitButtonColor: '#EA580C',
      backgroundColor: 'linear-gradient(to right, #FFF7ED 50%, #FFEDD5 50%)',
      accentColor: '#FB923C'
    },
    fonts: {
      titleFont: 'Inter',
      bodyFont: 'Inter'
    },
    spacing: {
      questionSpacing: '2rem',
      sectionSpacing: '3rem',
      contentPadding: '2rem'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight',
    layout: 'modern',
    colors: {
      titleColor: '#FFFFFF',
      questionColor: '#E5E7EB',
      descriptionColor: '#D1D5DB',
      submitButtonColor: '#4F46E5',
      backgroundColor: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
      accentColor: '#6366F1'
    },
    fonts: {
      titleFont: 'Inter',
      bodyFont: 'Inter'
    },
    spacing: {
      questionSpacing: '2rem',
      sectionSpacing: '3rem',
      contentPadding: '2rem'
    }
  },
  {
    id: 'rose-classic',
    name: 'Rose Classic',
    layout: 'classic',
    colors: {
      titleColor: '#831843',
      questionColor: '#9D174D',
      descriptionColor: '#BE185D',
      submitButtonColor: '#DB2777',
      backgroundColor: '#FFF1F2',
      accentColor: '#F472B6'
    },
    fonts: {
      titleFont: 'Inter',
      bodyFont: 'Inter'
    },
    spacing: {
      questionSpacing: '2rem',
      sectionSpacing: '3rem',
      contentPadding: '2rem'
    }
  }
]

const FormThemes: React.FC<FormThemesProps> = ({ onApplyTheme, currentTheme }) => {
  const [customThemes, setCustomThemes] = useState<Theme[]>([])
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null)
  const [showSaved, setShowSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [selectedLayout, setSelectedLayout] = useState<Theme['layout']>('modern')

  const handleCustomTheme = (theme: Theme) => {
    const newTheme = {
      ...theme,
      id: `custom-${Date.now()}`,
      name: `${theme.name} (Custom)`,
      isCustom: true
    }
    setEditingTheme(newTheme)
    setIsCustomizing(true)
    setSelectedLayout(theme.layout)
  }

  const saveCustomTheme = () => {
    if (editingTheme) {
      const updatedTheme = {
        ...editingTheme,
        layout: selectedLayout
      }
      const updatedThemes = [...customThemes]
      const existingIndex = updatedThemes.findIndex(t => t.id === editingTheme.id)
      
      if (existingIndex >= 0) {
        updatedThemes[existingIndex] = updatedTheme
      } else {
        updatedThemes.push(updatedTheme)
      }
      
      setCustomThemes(updatedThemes)
      setIsCustomizing(false)
      setEditingTheme(null)
      onApplyTheme(updatedTheme)
      
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    }
  }

  const updateEditingTheme = (field: string, value: string) => {
    if (editingTheme) {
      setEditingTheme({
        ...editingTheme,
        colors: {
          ...editingTheme.colors,
          [field]: value
        }
      })
    }
  }

  const handleDeleteTheme = (themeId: string) => {
    setShowDeleteConfirm(themeId)
  }

  const confirmDeleteTheme = (themeId: string) => {
    const updatedThemes = customThemes.filter(theme => theme.id !== themeId)
    setCustomThemes(updatedThemes)
    setShowDeleteConfirm(null)
  }

  const getLayoutIcon = (layout: Theme['layout']) => {
    switch (layout) {
      case 'modern':
        return '⚡️'
      case 'minimal':
        return '🎯'
      case 'gradient':
        return '🌈'
      case 'split':
        return '⚔️'
      case 'classic':
        return '📝'
      default:
        return '📋'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Palette className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-medium">Form Themes</h3>
        </div>
        {showSaved && (
          <div className="flex items-center text-green-600">
            <Check size={16} className="mr-1" />
            <span className="text-sm">Theme saved!</span>
          </div>
        )}
      </div>

      {isCustomizing && editingTheme ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-4">Customize Theme</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme Name</label>
              <input
                type="text"
                value={editingTheme.name}
                onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Layout Style</label>
              <div className="grid grid-cols-3 gap-2">
                {(['modern', 'minimal', 'gradient', 'split', 'classic'] as Theme['layout'][]).map((layout) => (
                  <button
                    key={layout}
                    onClick={() => setSelectedLayout(layout)}
                    className={`p-2 border rounded-md flex items-center justify-center ${
                      selectedLayout === layout
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="mr-2">{getLayoutIcon(layout)}</span>
                    {layout.charAt(0).toUpperCase() + layout.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(editingTheme.colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={value.startsWith('linear-gradient') ? '#6366F1' : value}
                      onChange={(e) => updateEditingTheme(key, e.target.value)}
                      className="p-1 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateEditingTheme(key, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsCustomizing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomTheme}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save Theme
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {[...predefinedThemes, ...customThemes].map((theme) => (
              <div
                key={theme.id}
                className="relative p-4 border border-gray-200 rounded-lg hover:border-purple-500 transition-all duration-200 group"
                style={{
                  background: theme.colors.backgroundColor
                }}
              >
                <div className="text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium" style={{ color: theme.colors.titleColor }}>
                      {theme.name}
                      {theme.isCustom && (
                        <span className="ml-2 text-xs text-purple-600">(Custom)</span>
                      )}
                    </h4>
                    <span className="text-sm opacity-75" style={{ color: theme.colors.titleColor }}>
                      {getLayoutIcon(theme.layout)}
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    {Object.values(theme.colors).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.startsWith('linear-gradient') ? '#6366F1' : color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                  <button
                    onClick={() => onApplyTheme(theme)}
                    className="p-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                    title="Apply Theme"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => handleCustomTheme(theme)}
                    className="p-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                    title="Customize Theme"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleCustomTheme({ ...theme, id: `copy-${Date.now()}` })}
                    className="p-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                    title="Duplicate Theme"
                  >
                    <Copy size={14} />
                  </button>
                  {theme.isCustom && (
                    <button
                      onClick={() => handleDeleteTheme(theme.id)}
                      className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      title="Delete Theme"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                {showDeleteConfirm === theme.id && (
                  <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center p-4 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">Are you sure you want to delete this theme?</p>
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => confirmDeleteTheme(theme.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => handleCustomTheme(predefinedThemes[0])}
            className="mt-4 w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors duration-200 flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            Create Custom Theme
          </button>
        </>
      )}
    </div>
  )
}

export default FormThemes