import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import PropTypes from 'prop-types'
import { STEP_TYPE_CONFIG } from '../../../data/stepTypes'
import { formatDuration } from '../../../utils/calculations/metrics'

function StepNode({ data, selected }) {
  const config = STEP_TYPE_CONFIG[data.type] || STEP_TYPE_CONFIG.custom

  return (
    <div
      className={`vsm-node vsm-node--${data.type} ${selected ? 'ring-2 ring-blue-500' : ''}`}
      data-testid={`step-node-${data.id}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-400 !w-3 !h-3"
      />

      <div className="vsm-node__header">
        <span className="text-lg">{config.icon}</span>
        <span className="truncate">{data.name}</span>
      </div>

      <div className="vsm-node__metrics">
        <div>
          <span className="text-gray-500">PT:</span>
          <span className="font-medium">{formatDuration(data.processTime)}</span>
        </div>
        <div>
          <span className="text-gray-500">LT:</span>
          <span className="font-medium">{formatDuration(data.leadTime)}</span>
        </div>
        <div>
          <span className="text-gray-500">%C&A:</span>
          <span className="font-medium">{data.percentCompleteAccurate}%</span>
        </div>
        {data.queueSize > 0 && (
          <div>
            <span className="text-gray-500">Queue:</span>
            <span className="font-medium">{data.queueSize}</span>
          </div>
        )}
        {data.batchSize > 1 && (
          <div>
            <span className="text-gray-500">Batch:</span>
            <span className="font-medium">{data.batchSize}</span>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400 !w-3 !h-3"
      />
    </div>
  )
}

StepNode.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    processTime: PropTypes.number.isRequired,
    leadTime: PropTypes.number.isRequired,
    percentCompleteAccurate: PropTypes.number.isRequired,
    queueSize: PropTypes.number,
    batchSize: PropTypes.number,
  }).isRequired,
  selected: PropTypes.bool,
}

StepNode.defaultProps = {
  selected: false,
}

export default memo(StepNode)
