import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useVsmStore } from '../../stores/vsmStore'
import {
  getTemplatesByCategory,
  CATEGORY_LABELS,
} from '../../data/stepTemplates'
import { STEP_TYPE_CONFIG } from '../../data/stepTypes'
import { formatDuration } from '../../utils/calculations/metrics'

function Sidebar() {
  const { addStep, selectStep, setEditing } = useVsmStore()
  const [expandedCategory, setExpandedCategory] = useState(null)

  const templatesByCategory = getTemplatesByCategory()

  const handleAddStep = useCallback(() => {
    const step = addStep('New Step')
    selectStep(step.id)
    setEditing(true)
  }, [addStep, selectStep, setEditing])

  const handleAddFromTemplate = useCallback(
    (template) => {
      const step = addStep(template.name, {
        type: template.type,
        description: template.description,
        processTime: template.processTime,
        leadTime: template.leadTime,
        percentCompleteAccurate: template.percentCompleteAccurate,
        queueSize: template.queueSize,
        batchSize: template.batchSize,
      })
      selectStep(step.id)
      setEditing(true)
    },
    [addStep, selectStep, setEditing]
  )

  const toggleCategory = useCallback((category) => {
    setExpandedCategory((prev) => (prev === category ? null : category))
  }, [])

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <button
        onClick={handleAddStep}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        data-testid="add-step-button"
      >
        <span className="text-xl">+</span>
        <span>Add Step</span>
      </button>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Step Templates
        </h2>
        <div className="space-y-1">
          {Object.entries(templatesByCategory).map(([category, templates]) => (
            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
              >
                <span>{CATEGORY_LABELS[category]}</span>
                <span className="text-gray-400">
                  {expandedCategory === category ? '−' : '+'}
                </span>
              </button>
              {expandedCategory === category && (
                <div className="border-t border-gray-200 bg-gray-50">
                  {templates.map((template) => {
                    const config = STEP_TYPE_CONFIG[template.type]
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleAddFromTemplate(template)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                        data-testid={`template-${template.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{config?.icon || '⚙️'}</span>
                          <span className="text-sm font-medium text-gray-700">
                            {template.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 ml-6">
                          PT: {formatDuration(template.processTime)} | LT:{' '}
                          {formatDuration(template.leadTime)}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          How to Use
        </h2>
        <div className="text-xs text-gray-600 space-y-3">
          <p>
            <strong>Add Step</strong> to create a new process step
          </p>
          <p>
            <strong>Click</strong> a step to select it
          </p>
          <p>
            <strong>Double-click</strong> a step to edit it
          </p>
          <p>
            <strong>Drag</strong> from handles to connect steps
          </p>
          <p>
            <strong>Delete</strong> key removes selected step
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Glossary
        </h2>
        <dl className="text-xs text-gray-600 space-y-2">
          <div>
            <dt className="font-semibold">PT (Process Time)</dt>
            <dd>Actual hands-on work time</dd>
          </div>
          <div>
            <dt className="font-semibold">LT (Lead Time)</dt>
            <dd>Total elapsed time including wait</dd>
          </div>
          <div>
            <dt className="font-semibold">%C&A</dt>
            <dd>Percent Complete & Accurate - quality passing to next step</dd>
          </div>
          <div>
            <dt className="font-semibold">Flow Efficiency</dt>
            <dd>PT ÷ LT - how much time is actual work vs waiting</dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}

export default Sidebar
