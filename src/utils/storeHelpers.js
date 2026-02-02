/**
 * Common store helper functions
 */

/**
 * Generate a unique ID using crypto.randomUUID
 * @returns {string} UUID
 */
export function generateId() {
  return crypto.randomUUID()
}

/**
 * Get current timestamp in ISO format
 * @returns {string} ISO timestamp
 */
export function timestamp() {
  return new Date().toISOString()
}
