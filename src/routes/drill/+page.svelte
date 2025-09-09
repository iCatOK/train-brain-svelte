<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { settings } from '$lib/stores/settings';
  import { dayCounter } from '$lib/stores/dayCounter';
  import { drillStore } from '$lib/stores/drillStore';
  import DrillStart from '$lib/components/drill/DrillStart.svelte';
  import DrillInterface from '$lib/components/drill/DrillInterface.svelte';
  import DrillResults from '$lib/components/drill/DrillResults.svelte';

  $: TOTAL_PROBLEMS = $settings.dailyProblemsCount;
  $: drillState = $drillStore;

  let answerInput: HTMLInputElement;
  let localUserAnswer = '';

  // Clear local answer when starting a new drill or when drill state resets
  $: if (drillState.gameState === 'idle' || drillState.gameState === 'finished') {
    localUserAnswer = '';
  }

  function startDrill() {
    drillStore.startDrill(TOTAL_PROBLEMS);
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    if (drillState.gameState !== 'drilling' || drillState.problems.length === 0) return;

    drillStore.submitAnswer(localUserAnswer);
    localUserAnswer = ''; // Clear the input after submission
    answerInput?.focus();
  }

  function goBack() {
    drillStore.stopTimer();
    drillStore.resetToIdle();
    goto('/');
  }

  onMount(() => {
    // Initialize the day counter
    dayCounter.initialize();
  });

  onDestroy(() => {
    drillStore.stopTimer();
  });

  $: currentProblemDisplay = drillState.problems.length > 0 && drillState.gameState === 'drilling'
    ? drillState.problems[drillState.currentProblemIndex]
    : null;
</script>

<div class="page-container">
  <div class="drill-card">
    {#if drillState.gameState === 'idle'}
      <DrillStart {startDrill} />
    {:else if drillState.gameState === 'drilling' && currentProblemDisplay}
      <DrillInterface {drillState} {currentProblemDisplay} {handleSubmit} {goBack} bind:localUserAnswer bind:answerInput />
    {:else if drillState.gameState === 'finished'}
      <DrillResults {drillState} {goto} />
    {/if}
  </div>
</div>

<style>
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 60px - 40px);
    padding: 20px;
    font-family: sans-serif;
  }

  .drill-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 24px 32px;
    width: 100%;
    max-width: 400px;
    text-align: center;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>