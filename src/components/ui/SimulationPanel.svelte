<script>
  import SimulationResults from '../simulation/SimulationResults.svelte'
  import ScenarioComparison from '../simulation/ScenarioComparison.svelte'
  import { simDataStore } from '../../stores/simulationDataStore.svelte.js'
  import { scenarioStore } from '../../stores/scenarioStore.svelte.js'

  let simulationResults = $derived(simDataStore.results)
  let simulationScenarios = $derived(scenarioStore.scenarios)
  let comparisonResults = $derived(scenarioStore.comparisonResults)
</script>

{#if simulationResults}
  <SimulationResults />
{/if}

{#if simulationScenarios.length > 0 || comparisonResults}
  <ScenarioComparison />
{/if}
