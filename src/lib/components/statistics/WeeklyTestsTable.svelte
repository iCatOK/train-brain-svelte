<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SessionData, SortKey, SortDirection } from '$lib/types/Statistics';

  export let sessions: SessionData[];
  export let sortKey: SortKey = 'date';
  export let sortDir: SortDirection = -1;

  const dispatch = createEventDispatcher<{
    sort: { key: SortKey };
  }>();

  function handleSort(key: SortKey) {
    dispatch('sort', { key });
  }

  function getSortAriaLabel(key: SortKey): "descending" | "ascending" | "none" {
    if (sortKey === key) {
      return sortDir === -1 ? 'descending' : 'ascending';
    }
    return 'none';
  }
</script>

<div class="weekly-table-container">
  <table class="weekly-table" aria-label="Weekly test results">
    <thead>
      <tr>
        <th
          on:click={() => handleSort('date')}
          aria-sort={getSortAriaLabel('date')}
        >
          Date
        </th>
        <th
          on:click={() => handleSort('counting')}
          aria-sort={getSortAriaLabel('counting')}
        >
          1-120 Time (sec)
        </th>
        <th
          on:click={() => handleSort('word')}
          aria-sort={getSortAriaLabel('word')}
        >
          Word Memory Accuracy (%)
        </th>
        <th
          on:click={() => handleSort('stroop')}
          aria-sort={getSortAriaLabel('stroop')}
        >
          Stroop Time (sec)
        </th>
      </tr>
    </thead>
    <tbody>
      {#each sessions as session (session.date)}
        <tr>
          <td>{session.dateStr}</td>
          <td>{session.countingTime}</td>
          <td>{session.wordAccuracy}</td>
          <td role="cell">{session.stroopTime}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .weekly-table-container {
    overflow-x: auto;
    margin-bottom: 24px;
  }

  .weekly-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .weekly-table th,
  .weekly-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  .weekly-table th {
    background-color: #f8fafc;
    font-weight: bold;
    color: #374151;
    cursor: pointer;
    user-select: none;
  }

  .weekly-table th:hover {
    background-color: #e2e8f0;
  }

  .weekly-table tr:hover {
    background-color: #f8fafc;
  }

  .weekly-table tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    .weekly-table {
      font-size: 0.875rem;
    }

    .weekly-table th,
    .weekly-table td {
      padding: 8px 4px;
    }
  }
</style>