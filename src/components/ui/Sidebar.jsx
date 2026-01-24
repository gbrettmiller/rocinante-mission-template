import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useVsmStore } from '../../stores/vsmStore'
import { STEP_TYPES, STEP_TYPE_CONFIG } from '../../data/stepTypes'

function Sidebar() {
  const { addStep } = useVsmStore()

  const handleAddStep = useCallback(
    (type) => {
      const config = STEP_TYPE_CONFIG[type]
      addStep(config.label, type)
    },
    [addStep]
  )

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Add Step
      </h2>
      <div className="space-y-2" data-testid="step-type-list">
        {Object.entries(STEP_TYPE_CONFIG).map(([type, config]) => (
          <button
            key={type}
            onClick={() => handleAddStep(type)}
            className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
            data-testid={`add-step-${type}`}
          >
            <span className="text-xl">{config.icon}</span>
            <span className="text-sm font-medium text-gray-700">
              {config.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Tips
        </h2>
        <div className="text-xs text-gray-600 space-y-3">
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
