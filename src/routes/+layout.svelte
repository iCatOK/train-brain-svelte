<script lang="ts">
  import '../app.css'; // Your global styles
  import { page } from '$app/stores';
  import { addMessages } from 'svelte-i18n';
  import { initI18n } from '$lib/i18n';
  import { _ } from 'svelte-i18n';

  // Simple icons (replace with SVGs or an icon library for better visuals)
  const IconBrain = '🧠';
  const IconDatabase = '💾';
  const IconSettings = '⚙️';
  const IconChart = '📊';

  // Helper function to check if link is active
  function isActive(path: string): boolean {
    return $page.url.pathname === path;
  }

  // Initialize i18n using server-loaded data (runs on SSR and client)
  initI18n($page.data.locale);
  addMessages('en', $page.data.messages.en);
  addMessages('ru', $page.data.messages.ru);
</script>

<div class="app-container">
  <header class="app-header">
    <a href="/" class="logo-link">
      <span class="logo-icon">{IconBrain}</span>
      <span class="logo-text">{$_('header.logo')}</span>
    </a>
    <nav class="main-nav">
      <a 
        href="/statistics" 
        class="nav-link"
        class:active={isActive('/statistics')}
      >
        <span class="nav-icon">{IconChart}</span>
        <span>{$_('header.statisticsNav')}</span>
      </a>
      <a 
        href="/settings" 
        class="nav-link"
        class:active={isActive('/settings')}
      >
        <span class="nav-icon">{IconSettings}</span>
        <span>{$_('header.settingsNav')}</span>
      </a>
    </nav>
  </header>

  <main class="app-content">
    <slot />
  </main>

</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #edf6ff;
    color: #333;
    min-height: 100vh;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    background-color: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #0ea5e9;
    font-weight: bold;
    font-size: 1.25rem;
    transition: color 0.2s ease;
  }

  .logo-link:hover {
    color: #0284c7;
  }

  .logo-icon {
    margin-right: 8px;
    font-size: 1.5rem;
  }

  .main-nav {
    display: flex;
    gap: 24px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    color: #4a5568;
    font-weight: 500;
    padding: 8px 0;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
  }

  .nav-link:hover {
    color: #0ea5e9;
  }

  .nav-link.active {
    color: #0ea5e9;
    border-bottom-color: #0ea5e9;
  }

  .nav-icon {
    font-size: 1rem;
  }

  .user-profile {
    display: flex;
    align-items: center;
    color: #4a5568;
    font-weight: 500;
  }

  .user-icon {
    margin-right: 8px;
    font-size: 1.1rem;
  }

  .app-content {
    flex-grow: 1;
    background-color: inherit;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .app-header {
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }

    .main-nav {
      gap: 16px;
    }
  }
</style>