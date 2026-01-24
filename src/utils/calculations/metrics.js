/**
 * Calculate total lead time for a value stream
 * @param {Array} steps - Array of process steps
 * @returns {number} Total lead time in minutes
 */
export function calculateTotalLeadTime(steps) {
  if (!steps || steps.length === 0) return 0
  return steps.reduce((sum, step) => sum + (step.leadTime || 0), 0)
}

/**
 * Calculate total process time for a value stream
 * @param {Array} steps - Array of process steps
 * @returns {number} Total process time in minutes
 */
export function calculateTotalProcessTime(steps) {
  if (!steps || steps.length === 0) return 0
  return steps.reduce((sum, step) => sum + (step.processTime || 0), 0)
}

/**
 * Calculate flow efficiency
 * @param {Array} steps - Array of process steps
 * @returns {Object} Flow efficiency result
 */
export function calculateFlowEfficiency(steps) {
  const processTime = calculateTotalProcessTime(steps)
  const leadTime = calculateTotalLeadTime(steps)

  if (leadTime === 0) {
    return {
      value: 0,
      percentage: 0,
      status: 'neutral',
      displayValue: 'N/A',
    }
  }

  const value = processTime / leadTime
  const percentage = value * 100

  let status
  if (percentage >= 25) {
    status = 'good'
  } else if (percentage >= 15) {
    status = 'warning'
  } else {
    status = 'critical'
  }

  return {
    value,
    percentage,
    status,
    displayValue: `${percentage.toFixed(1)}%`,
  }
}

/**
 * Calculate first pass yield (product of all %C&A)
 * @param {Array} steps - Array of process steps
 * @returns {Object} First pass yield result
 */
export function calculateFirstPassYield(steps) {
  if (!steps || steps.length === 0) {
    return {
      value: 0,
      percentage: 0,
      status: 'neutral',
      displayValue: 'N/A',
    }
  }

  const value = steps.reduce(
    (product, step) => product * ((step.percentCompleteAccurate || 100) / 100),
    1
  )
  const percentage = value * 100

  let status
  if (percentage >= 80) {
    status = 'good'
  } else if (percentage >= 60) {
    status = 'warning'
  } else {
    status = 'critical'
  }

  return {
    value,
    percentage,
    status,
    displayValue: `${percentage.toFixed(1)}%`,
  }
}

/**
 * Calculate all metrics for a value stream
 * @param {Array} steps - Array of process steps
 * @returns {Object} All calculated metrics
 */
export function calculateAllMetrics(steps) {
  const totalLeadTime = calculateTotalLeadTime(steps)
  const totalProcessTime = calculateTotalProcessTime(steps)
  const flowEfficiency = calculateFlowEfficiency(steps)
  const firstPassYield = calculateFirstPassYield(steps)

  return {
    totalLeadTime,
    totalProcessTime,
    flowEfficiency,
    firstPassYield,
    stepCount: steps?.length || 0,
  }
}

/**
 * Format duration for display
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export function formatDuration(minutes) {
  if (minutes === 0) return '0m'
  if (minutes < 60) return `${minutes}m`
  if (minutes < 480) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }
  const d = Math.floor(minutes / 480)
  const remainingMinutes = minutes % 480
  const h = Math.floor(remainingMinutes / 60)
  return h > 0 ? `${d}d ${h}h` : `${d}d`
}
