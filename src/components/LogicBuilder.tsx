import React, { useState } from 'react'
import Select from 'react-select'
import { FormQuestion, LogicRule } from '../types'
import { Plus, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react'

interface LogicBuilderProps {
  question: FormQuestion
  questions: FormQuestion[]
  onUpdateLogic: (questionId: string, logic: LogicRule[]) => void
}

const LogicBuilder: React.FC<LogicBuilderProps> = ({ question, questions, onUpdateLogic }) => {
  const [isAddingRule, setIsAddingRule] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [tempLogic, setTempLogic] = useState<LogicRule[]>(question.logic || [])

  const conditions = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Does not equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'notContains', label: 'Does not contain' },
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' }
  ]

  const actions = [
    { value: 'show', label: 'Show' },
    { value: 'hide', label: 'Hide' }
  ]

  const addLogicRule = () => {
    if (isAddingRule) return

    setIsAddingRule(true)
    const newRule: LogicRule = {
      id: Date.now().toString(),
      questionId: question.id,
      condition: 'equals',
      value: '',
      action: 'show',
      targetQuestionId: ''
    }
    setTempLogic([...tempLogic, newRule])
  }

  const updateRule = (ruleId: string, updates: Partial<LogicRule>) => {
    const updatedLogic = tempLogic.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    )
    setTempLogic(updatedLogic)
    if (updates.targetQuestionId) {
      setIsAddingRule(false)
    }
  }

  const removeRule = (ruleId: string) => {
    const updatedLogic = tempLogic.filter(rule => rule.id !== ruleId)
    setTempLogic(updatedLogic)
    setIsAddingRule(false)
  }

  const handleSave = () => {
    onUpdateLogic(question.id, tempLogic)
    setIsExpanded(false)
  }

  const handleToggle = () => {
    if (!isExpanded) {
      setTempLogic(question.logic || [])
    }
    setIsExpanded(!isExpanded)
    setIsAddingRule(false)
  }

  const otherQuestions = questions.filter(q => q.id !== question.id)

  return (
    <div className="mt-4 space-y-4">
      <div 
        className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
        onClick={handleToggle}
      >
        <h3 className="text-lg font-medium text-gray-900">Logic Rules {tempLogic.length > 0 && `(${tempLogic.length})`}</h3>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                addLogicRule()
              }}
              disabled={isAddingRule}
              className={`flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 ${
                isAddingRule ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Plus size={16} className="mr-1" />
              Add Rule
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleSave()
              }}
              className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            >
              <Save size={16} className="mr-1" />
              Save Rules
            </button>
          </div>

          {tempLogic.map(rule => (
            <div key={rule.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">If this question's answer:</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeRule(rule.id)
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <Select
                value={conditions.find(c => c.value === rule.condition)}
                options={conditions}
                onChange={option => updateRule(rule.id, { condition: option?.value as LogicRule['condition'] })}
                className="mb-2"
              />

              <input
                type="text"
                value={rule.value}
                onChange={e => updateRule(rule.id, { value: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter value"
                onClick={e => e.stopPropagation()}
              />

              <div className="flex items-center space-x-2">
                <Select
                  value={actions.find(a => a.value === rule.action)}
                  options={actions}
                  onChange={option => updateRule(rule.id, { action: option?.value as 'show' | 'hide' })}
                  className="w-24"
                />

                <Select
                  value={otherQuestions.find(q => q.id === rule.targetQuestionId)}
                  options={otherQuestions.map(q => ({ value: q.id, label: q.question }))}
                  onChange={option => updateRule(rule.id, { targetQuestionId: option?.value })}
                  className="flex-1"
                  placeholder="Select question"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LogicBuilder