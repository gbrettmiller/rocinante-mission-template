import { describe, it, expect } from 'vitest'
import { createConnection } from '../../../src/models/ConnectionFactory.js'

describe('createConnection', () => {
  describe('default values', () => {
    it('creates a forward connection by default', () => {
      const conn = createConnection('step-1', 'step-2')

      expect(conn.type).toBe('forward')
    })

    it('sets reworkRate to 0 by default', () => {
      const conn = createConnection('step-1', 'step-2')

      expect(conn.reworkRate).toBe(0)
    })

    it('sets source from first argument', () => {
      const conn = createConnection('source-id', 'target-id')

      expect(conn.source).toBe('source-id')
    })

    it('sets target from second argument', () => {
      const conn = createConnection('source-id', 'target-id')

      expect(conn.target).toBe('target-id')
    })

    it('generates composite ID from source and target', () => {
      const conn = createConnection('step-1', 'step-2')

      expect(conn.id).toBe('step-1-step-2')
    })
  })

  describe('forward connections', () => {
    it('creates forward connection explicitly', () => {
      const conn = createConnection('step-1', 'step-2', 'forward')

      expect(conn.type).toBe('forward')
      expect(conn.reworkRate).toBe(0)
    })

    it('ignores rework rate for forward connections', () => {
      const conn = createConnection('step-1', 'step-2', 'forward', 15)

      expect(conn.type).toBe('forward')
      expect(conn.reworkRate).toBe(15) // Still set but not meaningful for forward
    })
  })

  describe('rework connections', () => {
    it('creates rework connection with rate', () => {
      const conn = createConnection('step-2', 'step-1', 'rework', 15)

      expect(conn.type).toBe('rework')
      expect(conn.reworkRate).toBe(15)
    })

    it('creates rework connection with zero rate', () => {
      const conn = createConnection('step-2', 'step-1', 'rework', 0)

      expect(conn.type).toBe('rework')
      expect(conn.reworkRate).toBe(0)
    })

    it('creates rework connection with 100% rate', () => {
      const conn = createConnection('step-2', 'step-1', 'rework', 100)

      expect(conn.type).toBe('rework')
      expect(conn.reworkRate).toBe(100)
    })

    it('creates rework connection with typical 20% rate', () => {
      const conn = createConnection('testing', 'development', 'rework', 20)

      expect(conn.type).toBe('rework')
      expect(conn.reworkRate).toBe(20)
      expect(conn.source).toBe('testing')
      expect(conn.target).toBe('development')
    })
  })

  describe('ID generation', () => {
    it('generates unique ID based on source and target', () => {
      const conn1 = createConnection('a', 'b')
      const conn2 = createConnection('b', 'c')

      expect(conn1.id).toBe('a-b')
      expect(conn2.id).toBe('b-c')
    })

    it('generates different ID for reverse direction', () => {
      const forward = createConnection('step-1', 'step-2')
      const backward = createConnection('step-2', 'step-1')

      expect(forward.id).toBe('step-1-step-2')
      expect(backward.id).toBe('step-2-step-1')
      expect(forward.id).not.toBe(backward.id)
    })

    it('handles UUIDs in ID generation', () => {
      const sourceId = 'abc-123-def'
      const targetId = 'xyz-789-ghi'
      const conn = createConnection(sourceId, targetId)

      expect(conn.id).toBe('abc-123-def-xyz-789-ghi')
    })
  })

  describe('complete connection object', () => {
    it('returns object with all expected properties', () => {
      const conn = createConnection('step-1', 'step-2', 'rework', 25)

      expect(conn).toHaveProperty('id')
      expect(conn).toHaveProperty('source')
      expect(conn).toHaveProperty('target')
      expect(conn).toHaveProperty('type')
      expect(conn).toHaveProperty('reworkRate')
      expect(Object.keys(conn).length).toBe(5)
    })

    it('creates complete forward connection', () => {
      const conn = createConnection('dev', 'test', 'forward', 0)

      expect(conn).toEqual({
        id: 'dev-test',
        source: 'dev',
        target: 'test',
        type: 'forward',
        reworkRate: 0,
      })
    })

    it('creates complete rework connection', () => {
      const conn = createConnection('test', 'dev', 'rework', 15)

      expect(conn).toEqual({
        id: 'test-dev',
        source: 'test',
        target: 'dev',
        type: 'rework',
        reworkRate: 15,
      })
    })
  })

  describe('edge cases', () => {
    it('handles empty string source', () => {
      const conn = createConnection('', 'target')

      expect(conn.id).toBe('-target')
      expect(conn.source).toBe('')
    })

    it('handles empty string target', () => {
      const conn = createConnection('source', '')

      expect(conn.id).toBe('source-')
      expect(conn.target).toBe('')
    })

    it('handles same source and target', () => {
      const conn = createConnection('step-1', 'step-1')

      expect(conn.id).toBe('step-1-step-1')
      expect(conn.source).toBe('step-1')
      expect(conn.target).toBe('step-1')
    })
  })
})
