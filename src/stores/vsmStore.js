import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STEP_TYPES, STEP_TYPE_CONFIG } from '../data/stepTypes'

const createStep = (name, type = STEP_TYPES.CUSTOM, overrides = {}) => {
  const config = STEP_TYPE_CONFIG[type]
  return {
    id: crypto.randomUUID(),
    name,
    type,
    description: '',
    processTime: config.defaultProcessTime,
    leadTime: config.defaultLeadTime,
    percentCompleteAccurate: 100,
    queueSize: 0,
    batchSize: 1,
    peopleCount: 1,
    tools: [],
    position: { x: 0, y: 0 },
    ...overrides,
  }
}

const createConnection = (source, target, type = 'forward', reworkRate = 0) => ({
  id: `${source}-${target}`,
  source,
  target,
  type,
  reworkRate,
})

export const useVsmStore = create(
  persist(
    (set, get) => ({
      // VSM Data
      id: null,
      name: '',
      description: '',
      steps: [],
      connections: [],
      createdAt: null,
      updatedAt: null,

      // UI State
      selectedStepId: null,
      isEditing: false,

      // Actions
      createNewMap: (name) => {
        const now = new Date().toISOString()
        set({
          id: crypto.randomUUID(),
          name,
          description: '',
          steps: [],
          connections: [],
          createdAt: now,
          updatedAt: now,
          selectedStepId: null,
          isEditing: false,
        })
      },

      updateMapName: (name) => {
        set({
          name,
          updatedAt: new Date().toISOString(),
        })
      },

      updateMapDescription: (description) => {
        set({
          description,
          updatedAt: new Date().toISOString(),
        })
      },

      addStep: (name, type = STEP_TYPES.CUSTOM, overrides = {}) => {
        const { steps } = get()
        const position = {
          x: steps.length * 250 + 50,
          y: 150,
        }
        const newStep = createStep(name, type, { ...overrides, position })
        set({
          steps: [...steps, newStep],
          updatedAt: new Date().toISOString(),
        })
        return newStep
      },

      updateStep: (stepId, updates) => {
        const { steps } = get()
        set({
          steps: steps.map((step) =>
            step.id === stepId ? { ...step, ...updates } : step
          ),
          updatedAt: new Date().toISOString(),
        })
      },

      deleteStep: (stepId) => {
        const { steps, connections, selectedStepId } = get()
        set({
          steps: steps.filter((step) => step.id !== stepId),
          connections: connections.filter(
            (conn) => conn.source !== stepId && conn.target !== stepId
          ),
          selectedStepId: selectedStepId === stepId ? null : selectedStepId,
          updatedAt: new Date().toISOString(),
        })
      },

      updateStepPosition: (stepId, position) => {
        const { steps } = get()
        set({
          steps: steps.map((step) =>
            step.id === stepId ? { ...step, position } : step
          ),
        })
      },

      addConnection: (source, target, type = 'forward', reworkRate = 0) => {
        const { connections } = get()
        const existingConnection = connections.find(
          (c) => c.source === source && c.target === target
        )
        if (existingConnection) return null

        const newConnection = createConnection(source, target, type, reworkRate)
        set({
          connections: [...connections, newConnection],
          updatedAt: new Date().toISOString(),
        })
        return newConnection
      },

      deleteConnection: (connectionId) => {
        const { connections } = get()
        set({
          connections: connections.filter((conn) => conn.id !== connectionId),
          updatedAt: new Date().toISOString(),
        })
      },

      selectStep: (stepId) => {
        set({ selectedStepId: stepId })
      },

      clearSelection: () => {
        set({ selectedStepId: null })
      },

      setEditing: (isEditing) => {
        set({ isEditing })
      },

      // Import/Export
      exportToJson: () => {
        const { id, name, description, steps, connections, createdAt, updatedAt } =
          get()
        return JSON.stringify(
          { id, name, description, steps, connections, createdAt, updatedAt },
          null,
          2
        )
      },

      importFromJson: (jsonString) => {
        try {
          const data = JSON.parse(jsonString)
          set({
            id: data.id || crypto.randomUUID(),
            name: data.name || 'Imported Map',
            description: data.description || '',
            steps: data.steps || [],
            connections: data.connections || [],
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            selectedStepId: null,
            isEditing: false,
          })
          return true
        } catch (e) {
          console.error('Failed to import JSON:', e)
          return false
        }
      },

      clearMap: () => {
        set({
          id: null,
          name: '',
          description: '',
          steps: [],
          connections: [],
          createdAt: null,
          updatedAt: null,
          selectedStepId: null,
          isEditing: false,
        })
      },
    }),
    {
      name: 'vsm-workshop-storage',
    }
  )
)
