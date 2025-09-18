<script lang="ts">
  import HeroSection from '$lib/components/HeroSection.svelte';
  import NotificationCard from '$lib/components/NotificationCard.svelte';
  import ActionCard from '$lib/components/ActionCard.svelte';
  import OnboardingModal from '$lib/components/onboarding/OnboardingModal.svelte';
  import { dailyDrillPending } from '$lib/stores/dailyDrill';
  import { formattedDayCounter, dayCounter } from '$lib/stores/dayCounter';
  import { weeklyTestAvailable } from '$lib/stores/weeklyTestAvailability';
  import { drillResults } from '$lib/stores/drillResults';
  import { onboarding } from '$lib/stores/onboarding';
  import { onMount } from 'svelte';

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
      icon: '📝',
      iconClass: 'weekly-test-icon',
      title: 'Weekly Tests',
      subtitle: 'Challenge yourself with weekly assessments',
      description: 'Take weekly tests to track your long-term progress and identify areas for improvement.',
      buttonText: 'Start Weekly Test',
      targetRoute: '/weekly-test',
    },
  ];

  let showOnboardingModal = false;

  onMount(() => {
    // Check daily drill status when component mounts
    dailyDrillPending.checkStatus();
    // Initialize the day counter
    dayCounter.initialize();
    
    // Show onboarding modal for first-time users
    if (onboarding.isFirstTimeUser()) {
      showOnboardingModal = true;
    }
  });

  // Calculate remaining drills for weekly test
  $: remainingDrills = $drillResults.length > 0 ? 7 - ($drillResults.length % 7) : 7;
  $: weeklyButtonText = remainingDrills === 1 ? "Complete 1 drill" : `Complete ${remainingDrills} drills`;
  $: completedDrillsForNotification = $drillResults.length;
  $: notificationMessage = `You've completed ${completedDrillsForNotification} drills! Take your weekly test to track your progress.`;

  // If you needed to refresh the pending status from this page
  function handleRefreshNotification() {
    dailyDrillPending.checkStatus();
  }
  
  function handleCompleteOnboarding() {
    showOnboardingModal = false;
  }
  
</script>

<div class="home-container">
  <HeroSection
    title="Train Brain Game"
    subtitle="Sharpen your math skills with daily problems in Train Brain Game"
  />
  <div class="day-counter">{$formattedDayCounter}</div>
  {#if $weeklyTestAvailable}
    <NotificationCard
      icon="📝"
      title="Weekly Test Available!"
      message={notificationMessage}
      refreshIcon=""
      variant="success"
    />
  {:else}
    <NotificationCard
      icon={$dailyDrillPending ? "⚠️" : "✅"}
      title={$dailyDrillPending ? "Daily Drill Pending" : "Daily Drill Completed"}
      message={$dailyDrillPending
        ? "You haven't completed your math drill for today yet."
        : "Great job! You've completed your daily drill. Come back tomorrow for a new challenge!"}
      refreshIcon="🔄"
      variant={$dailyDrillPending ? "warning" : "success"}
      on:refresh={handleRefreshNotification}
    />
  {/if}

  <section class="action-cards-grid">
    {#each actionCardsData as card}
      {#if card.title === 'Math Drill'}
        <ActionCard
          {...card}
          buttonText={$dailyDrillPending ? card.buttonText : "Completed today"}
          disabled={!$dailyDrillPending}
          icon={card.icon}
          iconClass={card.iconClass}
          title={card.title}
          subtitle={card.subtitle}
          description={card.description}
          targetRoute={card.targetRoute}
        />
      {:else if card.title === 'Weekly Tests'}
        <ActionCard
          {...card}
          buttonText={$weeklyTestAvailable ? card.buttonText : weeklyButtonText}
          disabled={!$weeklyTestAvailable}
          icon={card.icon}
          iconClass={card.iconClass}
          title={card.title}
          subtitle={card.subtitle}
          description={card.description}
          targetRoute={card.targetRoute}
        />
      {:else}
        <ActionCard
          {...card}
          icon={card.icon}
          iconClass={card.iconClass}
          title={card.title}
          subtitle={card.subtitle}
          description={card.description}
          targetRoute={card.targetRoute}
        />
      {/if}
    {/each}
  </section>
  
</div>

{#if showOnboardingModal}
  <OnboardingModal on:close={handleCompleteOnboarding} />
{/if}

<style>
  /* Global styles for this page or layout specific styles remain */
  .home-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    position: relative;
  }

  /* Styles for HeroSection, NotificationCard, and ActionCard have been moved to their respective components */

  .action-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .day-counter {
    text-align: center;
    margin: -16px auto 16px;
    background-color: #0ea5e9;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1.1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: fit-content;
  }
  
</style>