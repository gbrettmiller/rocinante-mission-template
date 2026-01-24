import { describe, it, expect, beforeEach } from 'vitest'
import { useVsmStore } from '../../../src/stores/vsmStore'

describe('vsmStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useVsmStore.getState().clearMap()
  })

  describe('connection management', () => {
    beforeEach(() => {
      // Create a map with two steps for connection tests
      useVsmStore.getState().createNewMap('Test Map')
      useVsmStore.getState().addStep('Step 1')
      useVsmStore.getState().addStep('Step 2')
    })

    describe('addConnection', () => {
      it('creates a forward connection between steps', () => {
        const { steps, addConnection, connections } = useVsmStore.getState()
        const result = addConnection(steps[0].id, steps[1].id)

        expect(result).not.toBeNull()
        expect(useVsmStore.getState().connections).toHaveLength(1)
        expect(useVsmStore.getState().connections[0].type).toBe('forward')
      })

      it('creates a rework connection with rate', () => {
        const { steps, addConnection } = useVsmStore.getState()
        addConnection(steps[1].id, steps[0].id, 'rework', 20)

        const connections = useVsmStore.getState().connections
        expect(connections).toHaveLength(1)
        expect(connections[0].type).toBe('rework')
        expect(connections[0].reworkRate).toBe(20)
      })

      it('prevents duplicate connections', () => {
        const { steps, addConnection } = useVsmStore.getState()
        addConnection(steps[0].id, steps[1].id)
        const duplicate = addConnection(steps[0].id, steps[1].id)

        expect(duplicate).toBeNull()
        expect(useVsmStore.getState().connections).toHaveLength(1)
      })
    })

    describe('updateConnection', () => {
      it('updates connection type', () => {
        const { steps, addConnection, updateConnection } = useVsmStore.getState()
        addConnection(steps[0].id, steps[1].id)

        const connId = useVsmStore.getState().connections[0].id
        updateConnection(connId, { type: 'rework', reworkRate: 15 })

        const updated = useVsmStore.getState().connections[0]
        expect(updated.type).toBe('rework')
        expect(updated.reworkRate).toBe(15)
      })

      it('updates rework rate', () => {
        const { steps, addConnection, updateConnection } = useVsmStore.getState()
        addConnection(steps[0].id, steps[1].id, 'rework', 10)

        const connId = useVsmStore.getState().connections[0].id
        updateConnection(connId, { reworkRate: 25 })

        expect(useVsmStore.getState().connections[0].reworkRate).toBe(25)
      })
    })

    describe('deleteConnection', () => {
      it('removes the connection', () => {
        const { steps, addConnection, deleteConnection } = useVsmStore.getState()
        addConnection(steps[0].id, steps[1].id)

        const connId = useVsmStore.getState().connections[0].id
        deleteConnection(connId)

        expect(useVsmStore.getState().connections).toHaveLength(0)
      })

      it('clears selection when deleting selected connection', () => {
        const { steps, addConnection, selectConnection, deleteConnection } =
          useVsmStore.getState()
        addConnection(steps[0].id, steps[1].id)

        const connId = useVsmStore.getState().connections[0].id
        selectConnection(connId)
        expect(useVsmStore.getState().selectedConnectionId).toBe(connId)

        deleteConnection(connId)
        expect(useVsmStore.getState().selectedConnectionId).toBeNull()
        expect(useVsmStore.getState().isEditingConnection).toBe(false)
      })
    })

    describe('selectConnection', () => {
      it('selects a connection and opens editor', () => {
        const { steps, addConnection, selectConnection } = useVsmStore.getState()
        addConnection(steps[0].id, steps[1].id)

        const connId = useVsmStore.getState().connections[0].id
        selectConnection(connId)

        const state = useVsmStore.getState()
        expect(state.selectedConnectionId).toBe(connId)
        expect(state.isEditingConnection).toBe(true)
      })

      it('clears step selection when selecting connection', () => {
        const { steps, addConnection, selectStep, selectConnection } =
          useVsmStore.getState()
        selectStep(steps[0].id)
        expect(useVsmStore.getState().selectedStepId).toBe(steps[0].id)

        addConnection(steps[0].id, steps[1].id)
        const connId = useVsmStore.getState().connections[0].id
        selectConnection(connId)

        expect(useVsmStore.getState().selectedStepId).toBeNull()
        expect(useVsmStore.getState().isEditing).toBe(false)
      })
    })

    describe('clearConnectionSelection', () => {
      it('clears connection selection', () => {
        const { steps, addConnection, selectConnection, clearConnectionSelection } =
          useVsmStore.getState()
        addConnection(steps[0].id, steps[1].id)

        const connId = useVsmStore.getState().connections[0].id
        selectConnection(connId)
        clearConnectionSelection()

        const state = useVsmStore.getState()
        expect(state.selectedConnectionId).toBeNull()
        expect(state.isEditingConnection).toBe(false)
      })
    })
  })

  describe('loadTemplate', () => {
    it('loads a map template with steps', () => {
      const template = {
        name: 'Test Template',
        description: 'A test template',
        steps: [
          { name: 'Step A', processTime: 60, leadTime: 120, position: { x: 0, y: 0 } },
          { name: 'Step B', processTime: 30, leadTime: 60, position: { x: 200, y: 0 } },
        ],
        connections: [],
      }

      useVsmStore.getState().loadTemplate(template)

      const state = useVsmStore.getState()
      expect(state.name).toBe('Test Template')
      expect(state.steps).toHaveLength(2)
      expect(state.steps[0].name).toBe('Step A')
      expect(state.steps[1].name).toBe('Step B')
    })

    it('loads a map template with connections', () => {
      const template = {
        name: 'Template with Connections',
        description: 'Has connections',
        steps: [
          { name: 'Step A', processTime: 60, leadTime: 120, position: { x: 0, y: 0 } },
          { name: 'Step B', processTime: 30, leadTime: 60, position: { x: 200, y: 0 } },
        ],
        connections: [{ source: 0, target: 1, type: 'forward' }],
      }

      useVsmStore.getState().loadTemplate(template)

      const state = useVsmStore.getState()
      expect(state.connections).toHaveLength(1)
      expect(state.connections[0].source).toBe(state.steps[0].id)
      expect(state.connections[0].target).toBe(state.steps[1].id)
    })

    it('loads rework connections from template', () => {
      const template = {
        name: 'Template with Rework',
        description: 'Has rework',
        steps: [
          { name: 'Dev', processTime: 60, leadTime: 120, position: { x: 0, y: 0 } },
          { name: 'Test', processTime: 30, leadTime: 60, position: { x: 200, y: 0 } },
        ],
        connections: [
          { source: 0, target: 1, type: 'forward' },
          { source: 1, target: 0, type: 'rework', reworkRate: 20 },
        ],
      }

      useVsmStore.getState().loadTemplate(template)

      const state = useVsmStore.getState()
      expect(state.connections).toHaveLength(2)
      const reworkConn = state.connections.find((c) => c.type === 'rework')
      expect(reworkConn).toBeDefined()
      expect(reworkConn.reworkRate).toBe(20)
    })

    it('generates new IDs for steps and connections', () => {
      const template = {
        name: 'ID Test',
        description: 'Test ID generation',
        steps: [
          { id: 'old-id-1', name: 'Step A', position: { x: 0, y: 0 } },
          { id: 'old-id-2', name: 'Step B', position: { x: 200, y: 0 } },
        ],
        connections: [{ source: 0, target: 1, type: 'forward' }],
      }

      useVsmStore.getState().loadTemplate(template)

      const state = useVsmStore.getState()
      expect(state.steps[0].id).not.toBe('old-id-1')
      expect(state.steps[1].id).not.toBe('old-id-2')
    })
  })
})
