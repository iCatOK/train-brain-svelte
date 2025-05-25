<script lang="ts">
  import { goto } from '$app/navigation';

  // Simple icons (replace with SVGs or an icon library for better visuals)
  const IconAlert = '⚠️'; // Or a warning SVG
  const IconRefresh = '🔄';
  const IconMath = '➕'; // Or a calculator icon
  const IconChart = '📊';
  const IconSettings = '⚙️';
  const IconProfile = '👤';

  // Placeholder: In a real app, this would come from a store or API
  let dailyDrillPending = true;

  function startMathDrill() {
    goto('/drill');
  }
</script>

<div class="home-container">
  <section class="hero-section">
    <h1>Train Brain Game</h1>
    <p>Sharpen your math skills with daily problems in Train Brain Game</p>
  </section>

  {#if dailyDrillPending}
    <section class="notification-card">
      <div class="icon-area alert-icon">{IconAlert}</div>
      <div class="text-area">
        <h3>Daily Drill Pending <span class="refresh-icon">{IconRefresh}</span></h3>
        <p>You haven't completed your math drill for today yet.</p>
      </div>
    </section>
  {/if}

  <section class="action-cards-grid">
    <div class="action-card">
      <div class="card-icon math-icon">{IconMath}</div>
      <h2>Math Drill</h2>
      <p class="subtitle">Test your math skills with timed problems</p>
      <p class="description">
        Solve a series of addition, subtraction, and multiplication problems as
        quickly as you can.
      </p>
      <button on:click={startMathDrill}>Start Drill</button>
    </div>

    <div class="action-card">
      <div class="card-icon stats-icon">{IconChart}</div>
      <h2>Statistics</h2>
      <p class="subtitle">View your performance over time</p>
      <p class="description">
        Track your progress with detailed charts and see how your math skills
        improve.
      </p>
      <button on:click={startMathDrill}>View Statistics</button>
    </div>

    <div class="action-card">
      <div class="card-icon settings-icon">{IconSettings}</div>
      <h2>Settings</h2>
      <p class="subtitle">Customize your experience</p>
      <p class="description">
        Configure the number of problems and other preferences for your math
        drills.
      </p>
      <button on:click={startMathDrill}>View Settings</button>
    </div>

    <div class="action-card">
      <div class="card-icon profile-icon">{IconProfile}</div>
      <h2>Profile</h2>
      <p class="subtitle">View your personal statistics</p>
      <p class="description">
        Check your personal profile and track your progress over time.
      </p>
      <button on:click={startMathDrill}>View Profile</button>
    </div>
  </section>
</div>

<style>
  .home-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .hero-section {
    text-align: center;
    margin-bottom: 16px; /* Reduced margin as cards add space */
  }

  .hero-section h1 {
    font-size: 2.5rem;
    color: #1e293b; /* Darker blue/slate */
    margin-bottom: 8px;
  }

  .hero-section p {
    font-size: 1.125rem;
    color: #475569; /* Lighter slate */
  }

  .notification-card {
    background-color: #fffbeb; /* Light yellow from image (Tailwind amber-50) */
    border: 1px solid #fef3c7; /* Tailwind amber-200 */
    border-left: 4px solid #f59e0b; /* Tailwind amber-500 for left border */
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: flex-start; /* Align icon to top */
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .notification-card .icon-area {
    font-size: 1.5rem;
    padding-top: 2px; /* Align icon nicely with text */
  }
  .alert-icon {
    color: #f59e0b; /* Tailwind amber-500 */
  }
  .refresh-icon {
    font-size: 0.9em;
    margin-left: 4px;
    color: #6b7280; /* Tailwind gray-500 */
    display: inline-block; /* For potential animation */
  }

  .notification-card .text-area h3 {
    margin: 0 0 4px 0;
    font-size: 1.1rem;
    color: #78350f; /* Tailwind amber-800 */
    display: flex;
    align-items: center;
  }

  .notification-card .text-area p {
    margin: 0;
    font-size: 0.95rem;
    color: #92400e; /* Tailwind amber-700 */
  }

  .action-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .action-card {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
  }

  .card-icon {
    font-size: 1.8rem;
    margin-bottom: 12px;
    /* Specific icon colors could be set here */
  }
  .math-icon { color: #0ea5e9; /* Primary blue */ }
  .stats-icon { color: #10b981; /* Green */ }
  .settings-icon { color: #6366f1; /* Indigo */ }
  .profile-icon { color: #8b5cf6; /* Purple */ }


  .action-card h2 {
    font-size: 1.5rem;
    margin: 0 0 4px 0;
    color: #1e293b;
  }

  .action-card .subtitle {
    font-size: 0.9rem;
    color: #64748b; /* Lighter slate */
    margin-bottom: 12px;
  }

  .action-card .description {
    font-size: 0.95rem;
    color: #475569;
    margin-bottom: 20px;
    flex-grow: 1; /* Makes description take available space */
    line-height: 1.5;
  }

  .action-card button,
  .action-card .button-link {
    display: inline-block;
    width: 100%; /* Make buttons full width of card */
    background-color: #0ea5e9; /* Primary blue from image */
    color: white;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: auto; /* Pushes button to bottom */
  }

  .action-card button:hover,
  .action-card .button-link:hover {
    background-color: #0284c7; /* Darker blue */
  }
</style>