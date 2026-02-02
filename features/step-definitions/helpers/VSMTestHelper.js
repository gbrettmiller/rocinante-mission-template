import { vsmDataStore, vsmUIStore } from './testStores.js'

export class VSMTestHelper {
  constructor() {
    this.dataStore = vsmDataStore
    this.uiStore = vsmUIStore
  }

  get state() {
    // Return a state-like object for compatibility
    return {
      steps: this.dataStore.steps,
      connections: this.dataStore.connections,
      name: this.dataStore.name,
      id: this.dataStore.id,
      createNewMap: (name) => this.dataStore.createNewMap(name),
      addStep: (name, overrides) => this.dataStore.addStep(name, overrides),
      updateStep: (id, updates) => this.dataStore.updateStep(id, updates),
      deleteStep: (id) => this.dataStore.deleteStep(id),
      addConnection: (source, target, type, reworkRate) =>
        this.dataStore.addConnection(source, target, type, reworkRate),
      deleteConnection: (id) => this.dataStore.deleteConnection(id),
    }
  }

  createVSM(name) {
    this.dataStore.createNewMap(name || 'My Value Stream')
  }

  addStep(name, overrides = {}) {
    return this.dataStore.addStep(name, overrides)
  }

  findStepByName(name) {
    return this.dataStore.steps.find((s) => s.name === name)
  }

  findStepById(id) {
    return this.dataStore.steps.find((s) => s.id === id)
  }

  updateStep(stepId, updates) {
    this.dataStore.updateStep(stepId, updates)
  }

  deleteStep(stepId) {
    this.dataStore.deleteStep(stepId)
  }

  addConnection(sourceName, targetName, type = 'forward', reworkRate = 0) {
    const source = this.findStepByName(sourceName)
    const target = this.findStepByName(targetName)
    if (!source) {
      throw new Error(
        `addConnection failed: source step "${sourceName}" not found. Available steps: ${this.dataStore.steps.map((s) => s.name).join(', ') || 'none'}`
      )
    }
    if (!target) {
      throw new Error(
        `addConnection failed: target step "${targetName}" not found. Available steps: ${this.dataStore.steps.map((s) => s.name).join(', ') || 'none'}`
      )
    }
    return this.dataStore.addConnection(source.id, target.id, type, reworkRate)
  }

  deleteConnection(connectionId) {
    this.dataStore.deleteConnection(connectionId)
  }

  validateStep(step) {
    const errors = []
    if (step.leadTime < step.processTime) {
      errors.push('Lead time must be >= process time')
    }
    if (step.percentCompleteAccurate < 0 || step.percentCompleteAccurate > 100) {
      errors.push('%C&A must be between 0 and 100')
    }
    return errors
  }

  clearAll() {
    this.dataStore.clearMap()
    this.uiStore.clearUIState()
  }
}
