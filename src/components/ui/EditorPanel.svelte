<script>
  import StepEditor from '../builder/StepEditor.svelte'
  import ConnectionEditor from '../builder/ConnectionEditor.svelte'

  let {
    selectedStepId = null,
    isEditing = false,
    selectedConnectionId = null,
    isEditingConnection = false,
    onCloseEditor,
    onCloseConnectionEditor,
  } = $props()
</script>

{#if selectedStepId && isEditing}
  <StepEditor stepId={selectedStepId} onClose={onCloseEditor} />
{:else if selectedConnectionId && isEditingConnection}
  <ConnectionEditor connectionId={selectedConnectionId} onClose={onCloseConnectionEditor} />
{/if}
