<script lang="ts">
  import HeroSection from '$lib/components/HeroSection.svelte';
  import NotificationCard from '$lib/components/NotificationCard.svelte';
  import ActionCard from '$lib/components/ActionCard.svelte';
  // No longer need `goto` here if ActionCard handles its own navigation
  // No longer need individual Icon constants here if passed as props or handled by an Icon component

  // Placeholder: In a real app, this would come from a store or API
  let dailyDrillPending = true;

  // Data for the action cards
  const actionCardsData = [
    {
      icon: '➕', // Or use your Icon component: name: 'math'
      iconClass: 'math-icon',
      title: 'Math Drill',
      subtitle: 'Test your math skills with timed problems',
      description: 'Solve a series of addition, subtraction, and multiplication problems as quickly as you can.',
      buttonText: 'Start Drill',
      targetRoute: '/drill', // Target route for navigation
    },
    {
      icon: '📊',
      iconClass: 'stats-icon',
      title: 'Statistics',
      subtitle: 'View your performance over time',
      description: 'Track your progress with detailed charts and see how your math skills improve.',
      buttonText: 'View Statistics',
      targetRoute: '/statistics', // Example route
    },
    {
      icon: '⚙️',
      iconClass: 'settings-icon',
      title: 'Settings',
      subtitle: 'Customize your experience',
      description: 'Configure the number of problems and other preferences for your math drills.',
      buttonText: 'View Settings',
      targetRoute: '/settings', // Example route
    },
    {
      icon: '👤',
      iconClass: 'profile-icon',
      title: 'Profile',
      subtitle: 'View your personal statistics',
      description: 'Check your personal profile and track your progress over time.',
      buttonText: 'View Profile',
      targetRoute: '/profile', // Example route
    },
  ];

  // If you needed to refresh the pending status from this page
  function handleRefreshNotification() {
    // Logic to re-check or refresh the dailyDrillPending status
    console.log('Refreshing pending status...');
    // dailyDrillPending = ... (fetch new status)
  }
</script>

<div class="home-container">
  <HeroSection
    title="Train Brain Game"
    subtitle="Sharpen your math skills with daily problems in Train Brain Game"
  />

  {#if dailyDrillPending}
    <NotificationCard
      icon="⚠️"
      title="Daily Drill Pending"
      message="You haven't completed your math drill for today yet."
      refreshIcon="🔄"
      on:refresh={handleRefreshNotification}
    />
  {/if}

  <section class="action-cards-grid">
    {#each actionCardsData as card}
      <ActionCard
        icon={card.icon}
        iconClass={card.iconClass}
        title={card.title}
        subtitle={card.subtitle}
        description={card.description}
        buttonText={card.buttonText}
        targetRoute={card.targetRoute}
      />
    {/each}
  </section>
</div>

<style>
  /* Global styles for this page or layout specific styles remain */
  .home-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  /* Styles for HeroSection, NotificationCard, and ActionCard have been moved to their respective components */

  .action-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }
</style>