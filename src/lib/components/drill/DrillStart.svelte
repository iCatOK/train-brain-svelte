<script lang="ts">
  /**
   * Start drill function that bound to "Start drill button"
   */
  import { t } from "$lib/i18n"
  export let startDrill: () => void;
</script>

<button class="start-button" on:click={startDrill}>{$t('dailyDrillPage.startButton')}</button>

<style>
  .start-button {
    padding: 12px 24px;
    font-size: 1.2em;
    background-color: #0ea5e9;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .start-button:hover {
    background-color: #0284c7;
  }
</style>