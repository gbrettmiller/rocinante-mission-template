import { describe, it, expect } from 'vitest'
import { validateStep } from '../../../src/utils/validation/stepValidator.js'

describe('validateStep', () => {
  describe('name validation', () => {
    it('requires a name', () => {
      const result = validateStep({
        name: '',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.name).toBe('Name is required')
    })

    it('rejects whitespace-only name', () => {
      const result = validateStep({
        name: '   ',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.name).toBe('Name is required')
    })

    it('accepts valid name', () => {
      const result = validateStep({
        name: 'Development',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.valid).toBe(true)
      expect(result.errors.name).toBeUndefined()
    })
  })

  describe('processTime validation', () => {
    it('rejects negative process time', () => {
      const result = validateStep({
        name: 'Test',
        processTime: -10,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.processTime).toBe('Process time must be >= 0')
    })

    it('accepts zero process time', () => {
      const result = validateStep({
        name: 'Backlog',
        processTime: 0,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.errors.processTime).toBeUndefined()
    })

    it('accepts positive process time', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.errors.processTime).toBeUndefined()
    })
  })

  describe('leadTime validation', () => {
    it('rejects negative lead time', () => {
      // Note: When leadTime is negative, the "lead time < process time" check also triggers
      // and overwrites the error. The validator reports the more specific error.
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: -10,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.valid).toBe(false)
      // Error message depends on which check triggers last in the validator
      expect(result.errors.leadTime).toBe('Lead time must be >= process time')
    })

    it('rejects lead time less than process time', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 100,
        leadTime: 50,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.leadTime).toBe('Lead time must be >= process time')
    })

    it('accepts lead time equal to process time', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 60,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.errors.leadTime).toBeUndefined()
    })

    it('accepts lead time greater than process time', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.errors.leadTime).toBeUndefined()
    })
  })

  describe('percentCompleteAccurate validation', () => {
    it('rejects negative %C&A', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: -5,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.percentCompleteAccurate).toBe(
        '%C&A must be between 0 and 100'
      )
    })

    it('rejects %C&A over 100', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 105,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.percentCompleteAccurate).toBe(
        '%C&A must be between 0 and 100'
      )
    })

    it('accepts %C&A of 0', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 0,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.errors.percentCompleteAccurate).toBeUndefined()
    })

    it('accepts %C&A of 100', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.errors.percentCompleteAccurate).toBeUndefined()
    })

    it('accepts %C&A between 0 and 100', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 85,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.errors.percentCompleteAccurate).toBeUndefined()
    })
  })

  describe('queueSize validation', () => {
    it('rejects negative queue size', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: -3,
        batchSize: 1,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.queueSize).toBe('Queue size must be >= 0')
    })

    it('accepts zero queue size', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.errors.queueSize).toBeUndefined()
    })

    it('accepts positive queue size', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 10,
        batchSize: 1,
      })

      expect(result.errors.queueSize).toBeUndefined()
    })
  })

  describe('batchSize validation', () => {
    it('rejects zero batch size', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 0,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.batchSize).toBe('Batch size must be >= 1')
    })

    it('rejects negative batch size', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: -1,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.batchSize).toBe('Batch size must be >= 1')
    })

    it('accepts batch size of 1', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.errors.batchSize).toBeUndefined()
    })

    it('accepts batch size greater than 1', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 5,
      })

      expect(result.errors.batchSize).toBeUndefined()
    })
  })

  describe('peopleCount validation', () => {
    it('rejects zero people count when specified', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
        peopleCount: 0,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.peopleCount).toBe('People count must be >= 1')
    })

    it('rejects negative people count', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
        peopleCount: -2,
      })

      expect(result.valid).toBe(false)
      expect(result.errors.peopleCount).toBe('People count must be >= 1')
    })

    it('accepts people count of 1', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
        peopleCount: 1,
      })

      expect(result.errors.peopleCount).toBeUndefined()
    })

    it('accepts people count greater than 1', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
        peopleCount: 5,
      })

      expect(result.errors.peopleCount).toBeUndefined()
    })

    it('does not require peopleCount when not provided', () => {
      const result = validateStep({
        name: 'Test',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 100,
        queueSize: 0,
        batchSize: 1,
      })

      expect(result.errors.peopleCount).toBeUndefined()
    })
  })

  describe('multiple errors', () => {
    it('reports all validation errors at once', () => {
      const result = validateStep({
        name: '',
        processTime: -10,
        leadTime: -5,
        percentCompleteAccurate: 150,
        queueSize: -1,
        batchSize: 0,
        peopleCount: 0,
      })

      expect(result.valid).toBe(false)
      expect(Object.keys(result.errors).length).toBe(7)
      expect(result.errors.name).toBeDefined()
      expect(result.errors.processTime).toBeDefined()
      expect(result.errors.leadTime).toBeDefined()
      expect(result.errors.percentCompleteAccurate).toBeDefined()
      expect(result.errors.queueSize).toBeDefined()
      expect(result.errors.batchSize).toBeDefined()
      expect(result.errors.peopleCount).toBeDefined()
    })
  })

  describe('valid step', () => {
    it('returns valid true with empty errors for valid step', () => {
      const result = validateStep({
        name: 'Development',
        processTime: 60,
        leadTime: 240,
        percentCompleteAccurate: 85,
        queueSize: 3,
        batchSize: 1,
        peopleCount: 2,
      })

      expect(result.valid).toBe(true)
      expect(Object.keys(result.errors).length).toBe(0)
    })
  })
})
