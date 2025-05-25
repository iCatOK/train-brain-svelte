<script lang="ts">
  import '../app.css'; // Your global styles
  import { page } from '$app/stores'; // To get current path for active link styling

  // Simple icons (replace with SVGs or an icon library for better visuals)
  const IconBrain = '🧠';
  const IconUser = '👤';
  const IconDatabase = '💾';
  const IconSettings = '⚙️';
  const IconChart = '📊';

  // Placeholder for user data
  let userName = 'kamil';
</script>

<div class="app-container">
  <header class="app-header">
    <a href="/" class="logo-link">
      <span class="logo-icon">{IconBrain}</span>
      <span class="logo-text">Train Brain Game</span>
    </a>
    <nav class="main-nav">
      <a href="/statistics" class:active={$page.url.pathname === '/statistics'}>
        {IconChart} Statistics
      </a>
      <a href="/settings" class:active={$page.url.pathname === '/settings'}>
        {IconSettings} Settings
      </a>
      <a href="/db-status" class:active={$page.url.pathname === '/db-status'}>
        {IconDatabase} DB Status
      </a>
    </nav>
    <div class="user-profile">
      <span class="user-icon">{IconUser}</span>
      <span class="user-name">{userName}</span>
    </div>
  </header>

  <main class="app-content">
    <slot />
  </main>

  <!-- Optional: Debug toggles as seen in the image -->
  <footer class="app-footer-debug">
    <div>
      <label><input type="checkbox" /> Auth Debug</label>
    </div>
    <div>
      <label><input type="checkbox" /> Debug</label>
    </div>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #edf6ff; /* Lighter blue for the overall page background */
    color: #333;
    display: flex; /* For sticky footer potential */
    flex-direction: column; /* For sticky footer potential */
    min-height: 100vh; /* For sticky footer potential */
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
    background-color: #ffffff; /* White header */
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: sticky; /* Make header sticky */
    top: 0;
    z-index: 1000; /* Ensure it's above other content */
  }

  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #0ea5e9; /* Primary blue */
    font-weight: bold;
    font-size: 1.25rem;
  }

  .logo-icon {
    margin-right: 8px;
    font-size: 1.5rem; /* Adjust if using real SVGs */
  }

  .main-nav {
    display: flex;
    gap: 24px;
  }

  .main-nav a {
    text-decoration: none;
    color: #4a5568; /* Tailwind gray-600 */
    font-weight: 500;
    padding: 8px 0;
    border-bottom: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .main-nav a:hover,
  .main-nav a.active {
    color: #0ea5e9; /* Primary blue */
    border-bottom-color: #0ea5e9;
  }

  .user-profile {
    display: flex;
    align-items: center;
    color: #4a5568;
  }

  .user-icon {
    margin-right: 8px;
    /* Style for icon */
  }

  .app-content {
    flex-grow: 1; /* Allows content to take available space */
    padding: 0px; /* Remove padding here, let pages manage their own */
    /* background-color: #e0f2fe; /* Light blue background now handled by body */
  }

  .app-footer-debug {
    background-color: #1e293b; /* Dark background for debug footer */
    color: #94a3b8; /* Lighter text for debug footer */
    padding: 10px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 20px;
    font-size: 0.8rem;
  }

  .app-footer-debug label {
    display: flex;
    align-items: center;
    gap: 5px;
  }
</style>