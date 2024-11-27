import React, { useState } from 'react'
import { FormQuestion } from '../types'
import { Trash2, GripVertical, Plus, Settings, ThumbsUp } from 'lucide-react'
import LogicBuilder from './LogicBuilder'
import classNames from 'classnames'

interface QuestionBlockProps {
  question: FormQuestion
  onUpdate: (updatedQuestion: FormQuestion) => void
  onRemove: () => void
  onAddBlock: () => void
  dragHandleProps?: any
  isPro?: boolean
  allQuestions: FormQuestion[]
  onVisibilityChange?: (questionId: string, isVisible: boolean) => void
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  question,
  onUpdate,
  onRemove,
  onAddBlock,
  dragHandleProps,
  isPro = false,
  allQuestions,
  onVisibilityChange
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showLogic, setShowLogic] = useState(false)

  const isThankYouPage = question.type === 'thankYouPage'

  const handleUpdate = (field: keyof FormQuestion, value: any) => {
    onUpdate({ ...question, [field]: value })
  }

  const handleContactFieldToggle = (field: keyof Required<FormQuestion>['contactFields']) => {
    if (question.type === 'contactInfo' && question.contactFields) {
      const updatedFields = {
        ...question.contactFields,
        [field]: !question.contactFields[field]
      }
      onUpdate({
        ...question,
        contactFields: updatedFields
      })
    }
  }

  return (
    <div className={classNames(
      "bg-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md",
      "border border-gray-200 hover:border-purple-300",
      { 
        "opacity-50": question.visible === false,
        "bg-gradient-to-br from-purple-50 to-white": isThankYouPage
      }
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center flex-grow">
            <div {...dragHandleProps} className="cursor-move p-2 hover:bg-gray-100 rounded-lg mr-2">
              <GripVertical size={20} className="text-gray-400" />
            </div>
            {isThankYouPage && (
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mr-3">
                <ThumbsUp size={18} className="text-purple-600" />
              </div>
            )}
            {isEditing ? (
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleUpdate('question', e.target.value)}
                className="flex-1 text-lg font-medium bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              <h3
                className="text-lg font-medium cursor-pointer flex-grow hover:text-purple-600 transition-colors duration-200"
                onClick={() => setIsEditing(true)}
              >
                {isThankYouPage ? 'Thank You Page' : question.question}
              </h3>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLogic(!showLogic)}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              title="Logic Settings"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={onAddBlock}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
            >
              <Plus size={20} />
            </button>
            <button
              onClick={onRemove}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {!isThankYouPage && (
            <select
              value={question.type}
              onChange={(e) => handleUpdate('type', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="text">Short Text</option>
              <option value="longText">Long Text</option>
              <option value="number">Number</option>
              <option value="multipleChoice">Multiple Choice</option>
              <option value="checkbox">Checkbox</option>
              <option value="date">Date</option>
              <option value="email">Email</option>
              <option value="signature">Signature</option>
              <option value="statement">Statement</option>
              <option value="url">URL</option>
              <option value="fileUpload">File Upload</option>
              <option value="contactInfo">Contact Info</option>
              <option value="thankYouPage">Thank You Page</option>
            </select>
          )}

          {isThankYouPage && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={question.thankYouTitle || "Thank you! 🙌"}
                  onChange={(e) => handleUpdate('thankYouTitle', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Thank you! 🙌"
                />
              </div>

              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={question.thankYouText || "That's all. You may now close this window."}
                  onChange={(e) => handleUpdate('thankYouText', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="That's all. You may now close this window."
                />
              </div>

              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={question.thankYouButtonText || "Create your own Striform --"}
                  onChange={(e) => handleUpdate('thankYouButtonText', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Create your own Striform --"
                />
              </div>
            </div>
          )}

          {question.type === 'contactInfo' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Contact Fields</h4>
              <div className="space-y-2">
                {Object.entries(question.contactFields || {}).map(([field, enabled]) => (
                  <label key={field} className="flex items-center space-x-2 p-2 hover:bg-white rounded-lg transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => handleContactFieldToggle(field as keyof Required<FormQuestion>['contactFields'])}
                      className="form-checkbox h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-700 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {!isThankYouPage && (
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={question.required || false}
                onChange={(e) => handleUpdate('required', e.target.checked)}
                className="form-checkbox h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-gray-700">Required field</span>
            </div>
          )}
        </div>

        {showLogic && !isThankYouPage && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <LogicBuilder
              question={question}
              questions={allQuestions}
              onUpdateLogic={(questionId, logic) => handleUpdate('logic', logic)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionBlock