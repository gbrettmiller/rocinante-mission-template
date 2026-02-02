/**
 * VSM Domain Type Definitions (JSDoc)
 * These types are shared across all stores and components
 */

/**
 * @typedef {Object} Position
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 */

/**
 * @typedef {Object} Step
 * @property {string} id - Unique identifier
 * @property {string} name - Display name
 * @property {string} type - Step type (development, testing, etc.)
 * @property {string} [description] - Optional description
 * @property {number} processTime - Actual work time in minutes
 * @property {number} leadTime - Total elapsed time in minutes
 * @property {number} percentCompleteAccurate - Quality percentage (0-100)
 * @property {number} queueSize - Items waiting to enter
 * @property {number} batchSize - Items processed together
 * @property {number} peopleCount - Number of people
 * @property {string[]} tools - List of tools used
 * @property {Position} position - Canvas position
 */

/**
 * @typedef {'forward'|'rework'} ConnectionType
 */

/**
 * @typedef {Object} Connection
 * @property {string} id - Unique identifier
 * @property {string} source - Source step ID
 * @property {string} target - Target step ID
 * @property {ConnectionType} type - Connection type
 * @property {number} [reworkRate] - Rework percentage (0-100), only for rework connections
 */

/**
 * @typedef {Object} ValueStreamMap
 * @property {string|null} id - Unique identifier
 * @property {string} name - Map name
 * @property {string} description - Map description
 * @property {Step[]} steps - Array of process steps
 * @property {Connection[]} connections - Array of connections
 * @property {string|null} createdAt - Creation timestamp
 * @property {string|null} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} WorkItem
 * @property {string} id - Unique identifier
 * @property {string} currentStepId - Current step ID
 * @property {number} enteredAt - Time entered current step
 * @property {number} processedTime - Time processed so far
 * @property {boolean} completed - Whether item is complete
 */

/**
 * @typedef {Object} SimulationResults
 * @property {number} totalTime - Total simulation time
 * @property {number} avgCycleTime - Average cycle time
 * @property {number} throughput - Items per time unit
 * @property {Object.<string, number>} peakQueueByStep - Peak queue size per step
 * @property {string[]} bottleneckSteps - IDs of bottleneck steps
 */

/**
 * @typedef {Object} Scenario
 * @property {string} id - Unique identifier
 * @property {string} name - Scenario name
 * @property {Object} modifications - Step modifications
 * @property {SimulationResults|null} results - Results if run
 */

export {}
