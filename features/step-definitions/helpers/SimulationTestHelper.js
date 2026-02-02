import { simControlStore, simDataStore, scenarioStore } from './testStores.js'
import * as simEngine from '../../../src/utils/simulation/simulationEngine.js'

export class SimulationTestHelper {
  constructor(vsmHelper) {
    this.vsmHelper = vsmHelper
    this.controlStore = simControlStore
    this.dataStore = simDataStore
    this.scenarioStore = scenarioStore
    this.engine = simEngine
  }

  get state() {
    // Return a state-like object for compatibility
    return {
      // Control state
      isRunning: this.controlStore.isRunning,
      isPaused: this.controlStore.isPaused,
      speed: this.controlStore.speed,

      // Data state
      workItemCount: this.dataStore.workItemCount,
      workItems: this.dataStore.workItems,
      completedCount: this.dataStore.completedCount,
      elapsedTime: this.dataStore.elapsedTime,
      queueSizesByStepId: this.dataStore.queueSizesByStepId,
      queueHistory: this.dataStore.queueHistory,
      detectedBottlenecks: this.dataStore.detectedBottlenecks,
      results: this.dataStore.results,

      // Scenario state
      scenarios: this.scenarioStore.scenarios,
      activeScenarioId: this.scenarioStore.activeScenarioId,
      comparisonResults: this.scenarioStore.comparisonResults,

      // Actions
      setRunning: (running) => this.controlStore.setRunning(running),
      setPaused: (paused) => this.controlStore.setPaused(paused),
      setSpeed: (speed) => this.controlStore.setSpeed(speed),
      setWorkItemCount: (count) => this.dataStore.setWorkItemCount(count),
      updateWorkItems: (items) => this.dataStore.updateWorkItems(items),
      incrementCompletedCount: () => this.dataStore.incrementCompletedCount(),
      updateElapsedTime: (time) => this.dataStore.updateElapsedTime(time),
      updateQueueSizes: (sizes) => this.dataStore.updateQueueSizes(sizes),
      addQueueHistoryEntry: (entry) => this.dataStore.addQueueHistoryEntry(entry),
      setDetectedBottlenecks: (bottlenecks) =>
        this.dataStore.setDetectedBottlenecks(bottlenecks),
      setResults: (results) => this.dataStore.setResults(results),
      reset: () => {
        this.controlStore.reset()
        this.dataStore.reset()
      },
      addScenario: (scenario) => this.scenarioStore.addScenario(scenario),
      removeScenario: (id) => this.scenarioStore.removeScenario(id),
      setActiveScenario: (id) => this.scenarioStore.setActiveScenario(id),
      setComparisonResults: (results) =>
        this.scenarioStore.setComparisonResults(results),
    }
  }

  initSimulation() {
    const steps = this.vsmHelper.dataStore.steps
    const connections = this.vsmHelper.dataStore.connections
    const config = { workItemCount: this.dataStore.workItemCount }
    const initialState = this.engine.initSimulation(steps, connections, config)

    // Apply initial state to stores
    this.dataStore.updateWorkItems(initialState.workItems || [])
    this.dataStore.updateQueueSizes(initialState.queueSizesByStepId || {})
    if (initialState.elapsedTime !== undefined) {
      this.dataStore.updateElapsedTime(initialState.elapsedTime)
    }
  }

  generateWorkItems(count) {
    const firstStep = this.vsmHelper.dataStore.steps[0]
    return this.engine.generateWorkItems(count, firstStep?.id)
  }

  processTick() {
    const currentState = {
      workItems: this.dataStore.workItems,
      workItemCount: this.dataStore.workItemCount,
      queueSizesByStepId: this.dataStore.queueSizesByStepId,
      completedCount: this.dataStore.completedCount,
      elapsedTime: this.dataStore.elapsedTime,
      queueHistory: this.dataStore.queueHistory,
      speed: this.controlStore.speed,
      isPaused: this.controlStore.isPaused,
    }
    const steps = this.vsmHelper.dataStore.steps
    const connections = this.vsmHelper.dataStore.connections

    const newState = this.engine.processTick(currentState, steps, connections)

    // Apply new state to stores
    this.dataStore.updateWorkItems(newState.workItems || [])
    this.dataStore.updateQueueSizes(newState.queueSizesByStepId || {})
    if (newState.completedCount !== undefined) {
      this.dataStore.setCompletedCount(newState.completedCount)
    }
    if (newState.elapsedTime !== undefined) {
      this.dataStore.updateElapsedTime(newState.elapsedTime)
    }
  }

  detectBottlenecks() {
    const steps = this.vsmHelper.dataStore.steps
    const queueSizes = this.dataStore.queueSizesByStepId
    const bottlenecks = this.engine.detectBottlenecks(steps, queueSizes)
    this.dataStore.setDetectedBottlenecks(bottlenecks)
  }

  runSimulationToCompletion(maxTicks = 10000) {
    const currentState = {
      workItems: this.dataStore.workItems,
      workItemCount: this.dataStore.workItemCount,
      queueSizesByStepId: this.dataStore.queueSizesByStepId,
      completedCount: this.dataStore.completedCount,
      elapsedTime: this.dataStore.elapsedTime,
      queueHistory: this.dataStore.queueHistory,
      speed: this.controlStore.speed,
      isPaused: false,
    }
    const steps = this.vsmHelper.dataStore.steps
    const connections = this.vsmHelper.dataStore.connections

    const finalState = this.engine.runSimulationToCompletion(
      currentState,
      steps,
      connections,
      maxTicks
    )

    // Check if simulation completed or hit maxTicks limit
    if (finalState.completedCount < currentState.workItemCount) {
      console.warn(
        `Simulation hit maxTicks limit (${maxTicks}). Only ${finalState.completedCount}/${currentState.workItemCount} items completed. ` +
          `Consider increasing maxTicks or checking for simulation deadlock.`
      )
    }

    // Apply final state to stores
    this.dataStore.updateWorkItems(finalState.workItems || [])
    this.dataStore.updateQueueSizes(finalState.queueSizesByStepId || {})
    if (finalState.completedCount !== undefined) {
      this.dataStore.setCompletedCount(finalState.completedCount)
    }
    if (finalState.elapsedTime !== undefined) {
      this.dataStore.updateElapsedTime(finalState.elapsedTime)
    }
    if (finalState.detectedBottlenecks !== undefined) {
      this.dataStore.setDetectedBottlenecks(finalState.detectedBottlenecks)
    }
    if (finalState.queueHistory !== undefined) {
      this.dataStore.setQueueHistory(finalState.queueHistory)
    }
    if (finalState.results !== undefined) {
      this.dataStore.setResults(finalState.results)
    }
  }

  resetSimulation() {
    this.controlStore.reset()
    this.dataStore.reset()
  }

  createScenario() {
    const steps = this.vsmHelper.dataStore.steps
    const connections = this.vsmHelper.dataStore.connections
    const scenario = {
      id: crypto.randomUUID(),
      name: `Scenario ${this.scenarioStore.scenarios.length + 1}`,
      steps: steps.map((s) => ({ ...s })),
      connections: connections.map((c) => ({ ...c })),
      saved: false,
    }
    this.scenarioStore.addScenario(scenario)
    return scenario
  }

  clearAll() {
    this.controlStore.reset()
    this.dataStore.reset()
    this.scenarioStore.reset()
  }
}
