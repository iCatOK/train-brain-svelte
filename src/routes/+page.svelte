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
  import { _, waitLocale } from 'svelte-i18n';

  let showOnboardingModal = false;
  let ready = true; // i18n initialized in layout

  onMount(async () => {
    // Safety check for client-side locale readiness
    await waitLocale();
    
    // Check daily drill status when component mounts
    dailyDrillPending.checkStatus();
    // Initialize the day counter
    dayCounter.initialize();
    
    // Show onboarding modal for first-time users
    if (onboarding.isFirstTimeUser()) {
      showOnboardingModal = true;
    }
  });

  // Data for the action cards (i18n now available via layout init)
  const actionCardsData = [
    {
      icon: '➕', // Or use your Icon component: name: 'math'
      iconClass: 'math-icon',
      title: $_('mathDrill.title'),
      subtitle: $_('mathDrill.description'),
      description: $_('mathDrill.detailedDescription'),
      buttonText: $_('mathDrill.startButton'),
      targetRoute: '/drill', // Target route for navigation
    },
    {
      icon: '📊',
      iconClass: 'stats-icon',
      title: $_('statistics.title'),
      subtitle: $_('statistics.description'),
      description: $_('statistics.detailedDescription'),
      buttonText: $_('statistics.viewButton'),
      targetRoute: '/statistics', // Example route
    },
    {
      icon: '⚙️',
      iconClass: 'settings-icon',
      title: $_('settings.title'),
      subtitle: $_('settings.description'),
      description: $_('settings.detailedDescription'),
      buttonText: $_('settings.viewButton'),
      targetRoute: '/settings', // Example route
    },
    {
      icon: '📝',
      iconClass: 'weekly-test-icon',
      title: $_('weeklyTests.title'),
      subtitle: $_('weeklyTests.description'),
      description: $_('weeklyTests.detailedDescription'),
      buttonText: $_('weeklyTests.completeButton'), // Overridden dynamically in template
      targetRoute: '/weekly-test',
    },
  ];

  // Calculate remaining drills for weekly test
  $: remainingDrills = $drillResults.length > 0 ? 7 - ($drillResults.length % 7) : 7;
  $: completedDrillsForNotification = $drillResults.length;
  $: notificationMessage = $_('weeklyTestAvailable.subtitle', { values: { count: completedDrillsForNotification } });

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
    title={$_('heading.title')}
    subtitle={$_('heading.subtitle')}
  />
  <div class="day-counter">{$formattedDayCounter}</div>
  {#if $weeklyTestAvailable}
    <NotificationCard
      icon="📝"
      title={$_('weeklyTestAvailable.title')}
      message={notificationMessage}
      refreshIcon=""
      variant="success"
    />
  {:else}
    <NotificationCard
      icon={$dailyDrillPending ? "⚠️" : "✅"}
      title={$dailyDrillPending ? $_('dailyDrillPending.title') : $_('dailyDrillCompleted.title')}
      message={$dailyDrillPending
        ? $_('dailyDrillPending.subtitle')
        : $_('dailyDrillCompleted.subtitle')}
      refreshIcon="🔄"
      variant={$dailyDrillPending ? "warning" : "success"}
      on:refresh={handleRefreshNotification}
    />
  {/if}

  <section class="action-cards-grid">
    {#each actionCardsData as card}
      {#if card.title === $_('mathDrill.title')}
        <ActionCard
          {...card}
          buttonText={$dailyDrillPending ? card.buttonText : $_('mathDrill.completedToday')}
          disabled={!$dailyDrillPending}
          icon={card.icon}
          iconClass={card.iconClass}
          title={card.title}
          subtitle={card.subtitle}
          description={card.description}
          targetRoute={card.targetRoute}
        />
      {:else if card.title === $_('weeklyTests.title')}
        <ActionCard
          {...card}
          buttonText={$weeklyTestAvailable ? card.buttonText : $_('weeklyTests.completeButtonDisabled', { values: { count: remainingDrills }})}
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