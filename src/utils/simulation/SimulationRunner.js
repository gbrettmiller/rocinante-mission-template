import { processTick, calculateResults } from './simulationEngine'

/**
 * Independent animation loop manager for VSM simulation
 * Decoupled from React lifecycle for better testability and control
 */
export const createSimulationRunner = () => {
  let animationFrameId = null
  let stateRef = null
  let steps = null
  let connections = null
  let callbacks = {
    onTick: null,
    onComplete: null,
  }
  let isRunning = false
  let isPaused = false

  /**
   * Animation loop function
   */
  const animate = () => {
    if (!isRunning || isPaused) {
      return
    }

    const currentState = {
      ...stateRef,
      queueHistory: [],
    }

    const newState = processTick(currentState, steps, connections)

    // Notify tick callback
    if (callbacks.onTick) {
      callbacks.onTick(newState)
    }

    // Check if simulation is complete
    if (newState.completedCount >= newState.workItemCount) {
      isRunning = false
      const finalResults = calculateResults(newState, steps)

      if (callbacks.onComplete) {
        callbacks.onComplete(finalResults)
      }
      return
    }

    // Update state ref for next frame
    stateRef = newState

    animationFrameId = requestAnimationFrame(animate)
  }

  /**
   * Start the animation loop
   * @param {Object} initialState - Initial simulation state
   * @param {Array} stepsParam - VSM steps
   * @param {Array} connectionsParam - VSM connections
   * @param {Object} callbacksParam - { onTick, onComplete }
   */
  const start = (initialState, stepsParam, connectionsParam, callbacksParam) => {
    stateRef = initialState
    steps = stepsParam
    connections = connectionsParam
    callbacks = callbacksParam
    isRunning = true
    isPaused = false

    animate()
  }

  /**
   * Pause the animation loop
   */
  const pause = () => {
    isPaused = true
  }

  /**
   * Resume the animation loop
   */
  const resume = () => {
    isPaused = false
    animate()
  }

  /**
   * Stop and cleanup the animation loop
   */
  const stop = () => {
    isRunning = false
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  return {
    start,
    pause,
    resume,
    stop,
  }
}
