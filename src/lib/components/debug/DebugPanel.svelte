<script lang="ts">
  import { debugStore } from '$lib/stores/debugStore';
  import { drillResults } from '$lib/stores/drillResults';
  import { weeklyTestStore } from '$lib/stores/weeklyTestResults';
  import { onMount } from 'svelte';

  let isVisible = false;
  let isExpanded = false;

  // Environment-based debug mode availability
  const isDebugModeAvailable = (() => {
    const toBool = (v: unknown) => v === 'true' || v === true;
    const explicitSetting = toBool(import.meta.env.VITE_DEBUG_MODE_ENABLED);
    const autoDetect = toBool(import.meta.env.VITE_DEBUG_MODE_AUTO);
    const isDev = !!import.meta.env.DEV;

    // Require explicit enable in production; in dev allow auto when opted-in
    if (!isDev) {
      return explicitSetting === true; // production: only explicit true enables
    }

    // development: explicit true enables, otherwise allow auto if requested
    if (explicitSetting === true) return true;
    if (autoDetect === true) return true;

    // default safe: disabled unless explicitly turned on
    return false;
  })();

  // Subscribe to debug store
  $: debugState = $debugStore;

  // Keyboard shortcut activation
  function handleKeydown(event: KeyboardEvent) {
    if (!isDebugModeAvailable) return; // Block keyboard shortcuts if debug mode is disabled
    
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
      event.preventDefault();
      toggleDebugMode();
    }
    if (event.key === 'Escape' && isVisible) {
      hidePanel();
    }
  }

  function toggleDebugMode() {
    debugStore.toggle();
    isVisible = $debugStore.isEnabled;
  }

  function showPanel() {
    debugStore.enable();
    isVisible = true;
  }

  function hidePanel() {
    debugStore.disable();
    isVisible = false;
    isExpanded = false;
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  // Data generation handlers
  async function generateDrillData(preset: string) {
    try {
      const presetConfig = debugStore.presets[preset as keyof typeof debugStore.presets];
      const generatedResults = debugStore.generateDrillResults(presetConfig);
      drillResults.setResults(generatedResults);
      console.log(`Generated ${generatedResults.length} drill results using "${preset}" preset`);
    } catch (error) {
      console.error('Error generating drill data:', error);
    }
  }

  async function generateWeeklyData(preset: string) {
    try {
      const presetConfig = debugStore.presets[preset as keyof typeof debugStore.presets];
      const generatedData = debugStore.generateWeeklyTestData(presetConfig);

      // Use bulk set methods for better performance and correct date handling
      weeklyTestStore.setCountingTestResults(generatedData.countingTest);
      weeklyTestStore.setWordMemoryTestResults(generatedData.wordMemoryTest);
      weeklyTestStore.setStroopTestResults(generatedData.stroopTest);

      console.log(`Generated weekly test data using "${preset}" preset:`, {
        counting: generatedData.countingTest.length,
        wordMemory: generatedData.wordMemoryTest.length,
        stroop: generatedData.stroopTest.length
      });
    } catch (error) {
      console.error('Error generating weekly data:', error);
    }
  }

  function clearAllData() {
    drillResults.clearResults();
    weeklyTestStore.clearAllResults();
    console.log('Cleared all test data');
  }

  onMount(() => {
    if (isDebugModeAvailable) {
      window.addEventListener('keydown', handleKeydown);
      return () => window.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

<!-- Debug Toggle Button (only visible when debug mode is available) -->
{#if isDebugModeAvailable}
<div class="debug-toggle">
  <button
    class="toggle-btn"
    class:active={isVisible}
    onclick={toggleDebugMode}
    title="Toggle Debug Mode (Ctrl+Shift+D)"
  >
    🐛
  </button>
</div>
{/if}

<!-- Debug Panel (only when debug mode is available and visible) -->
{#if isDebugModeAvailable && isVisible}
  <div class="debug-panel" class:expanded={isExpanded}>
    <div class="debug-header">
      <div class="debug-title">
        <span class="debug-icon">🛠️</span>
        <span>Chart Debug Mode</span>
      </div>
      <div class="debug-actions">
        <button class="expand-btn" onclick={toggleExpanded} title={isExpanded ? 'Collapse' : 'Expand'}>
          {isExpanded ? '📋' : '📊'}
        </button>
        <button class="close-btn" onclick={hidePanel} title="Close (Esc)">✕</button>
      </div>
    </div>

    <div class="debug-content" class:visible={isExpanded}>
      <div class="preset-section">
        <h3>Quick Presets</h3>
        <div class="preset-grid">
          <button class="preset-btn beginner" onclick={() => generateDrillData('beginner')}>
            🌱 Beginner<br><small>14 days, 40% active</small>
          </button>
          <button class="preset-btn intermediate" onclick={() => generateDrillData('intermediate')}>
            ⚡ Intermediate<br><small>30 days, 70% active</small>
          </button>
          <button class="preset-btn expert" onclick={() => generateDrillData('expert')}>
            🏆 Expert<br><small>60 days, 85% active</small>
          </button>
          <button class="preset-btn realistic" onclick={() => generateDrillData('realistic')}>
            🎯 Realistic<br><small>45 days, 60% active</small>
          </button>
        </div>
      </div>

      <div class="weekly-section">
        <h3>Weekly Test Data</h3>
        <div class="weekly-controls">
          <button class="weekly-btn" onclick={() => generateWeeklyData('beginner')}>
            Generate Beginner Weekly Data (40% participation)
          </button>
          <button class="weekly-btn" onclick={() => generateWeeklyData('realistic')}>
            Generate Realistic Weekly Data (60% participation)
          </button>
        </div>
      </div>

      <div class="action-section">
        <button class="danger-btn" onclick={clearAllData}>
          🗑️ Clear All Data
        </button>
      </div>

      <div class="info-section">
        <small>
          <strong>Shortcuts:</strong> Ctrl+Shift+D (toggle) • Esc (close)<br>
          <strong>Business Rules:</strong> Max 1 drill/day • Max 1 weekly test/week<br>
          Data is immediately applied to charts above.
        </small>
      </div>
    </div>
  </div>
{/if}

<style>
  .debug-toggle {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 1000;
  }

  .toggle-btn {
    background: #1e293b;
    color: white;
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
  }

  .toggle-btn:hover {
    background: #334155;
    transform: scale(1.05);
  }

  .toggle-btn.active {
    background: #0ea5e9;
  }

  .debug-panel {
    position: fixed;
    top: 140px;
    right: 20px;
    width: 320px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    z-index: 999;
    border: 1px solid #e2e8f0;
  }

  .debug-panel.expanded {
    width: 380px;
  }

  .debug-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
    border-radius: 12px 12px 0 0;
  }

  .debug-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;
    color: #1e293b;
  }

  .debug-actions {
    display: flex;
    gap: 8px;
  }

  .expand-btn, .close-btn {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .expand-btn:hover, .close-btn:hover {
    background: #e2e8f0;
  }

  .debug-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .debug-content.visible {
    max-height: 600px;
    padding: 16px;
  }

  .preset-section, .weekly-section, .action-section {
    margin-bottom: 20px;
  }

  .preset-section h3, .weekly-section h3 {
    margin: 0 0 12px 0;
    color: #374151;
    font-size: 14px;
    font-weight: 600;
  }

  .preset-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .preset-btn {
    padding: 12px 8px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
    line-height: 1.2;
    transition: all 0.2s;
  }

  .preset-btn:hover {
    border-color: #0ea5e9;
    transform: translateY(-1px);
  }

  .preset-btn.beginner { border-left: 4px solid #10b981; }
  .preset-btn.intermediate { border-left: 4px solid #f59e0b; }
  .preset-btn.expert { border-left: 4px solid #ef4444; }
  .preset-btn.realistic { border-left: 4px solid #0ea5e9; }

  .weekly-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .weekly-btn {
    padding: 10px 12px;
    border: 1px solid #0ea5e9;
    background: white;
    color: #0ea5e9;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
  }

  .weekly-btn:hover {
    background: #0ea5e9;
    color: white;
  }

  .danger-btn {
    width: 100%;
    padding: 10px;
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fecaca;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
  }

  .danger-btn:hover {
    background: #fecaca;
    border-color: #f87171;
  }

  .info-section {
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
    color: #6b7280;
    line-height: 1.4;
  }

  small {
    font-size: 11px;
  }

  @media (max-width: 768px) {
    .debug-toggle {
      right: 10px;
      top: 70px;
    }
    
    .debug-panel {
      right: 10px;
      top: 130px;
      width: 280px;
    }
    
    .debug-panel.expanded {
      width: 320px;
    }
  }
</style>