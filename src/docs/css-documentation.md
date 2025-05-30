# Train Brain Svelte CSS Documentation

This document contains all CSS styles used in the Train Brain Svelte project, organized by component.

## Table of Contents

1. [Layout](#layout)
2. [Home Page](#home-page)
3. [Drill Page](#drill-page)
4. [Settings Page](#settings-page)
5. [Statistics Page](#statistics-page)
6. [Components](#components)
   - [ActionCard](#actioncard)
   - [HeroSection](#herosection)
   - [NotificationCard](#notificationcard)

## Layout

File: `src/routes/+layout.svelte`

```css
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

.app-footer-debug {
  background-color: #1e293b;
  color: #94a3b8;
  padding: 10px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  font-size: 0.8rem;
}

.debug-control label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.debug-control label:hover {
  color: #cbd5e1;
}

.debug-control input[type="checkbox"] {
  margin: 0;
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

  .app-footer-debug {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
```

## Home Page

File: `src/routes/+page.svelte`

```css
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
```

## Drill Page

File: `src/routes/drill/+page.svelte`

```css
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* This helps center the card */
  min-height: calc(100vh - 60px - 40px); /* Adjust 60px for header, 40px for footer approx. */
  padding: 20px;
  font-family: sans-serif; /* Can inherit from body */
}

.drill-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px 32px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  min-height: 300px; /* Ensure card has some height */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center content vertically if card is taller */
}

.start-button {
  padding: 12px 24px;
  font-size: 1.2em;
  background-color: #0ea5e9; /* Blue from image */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.start-button:hover {
  background-color: #0284c7;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  width: 100%; /* Ensure it takes full width of card */
}

.back-button {
  background: none;
  border: none;
  font-size: 1.8em;
  cursor: pointer;
  color: #333;
  padding: 0; /* Remove padding to align better */
}

.stopwatch {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
}

.progress-indicator {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 24px;
}

.problem-area {
  font-size: 2.8em; /* Larger font for problem */
  font-weight: bold;
  margin-bottom: 24px;
  color: #333;
  word-wrap: break-word; /* Ensure long problems don't break layout */
}

.answer-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.answer-form input {
  padding: 12px;
  font-size: 1.1em;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}
/* Hide number input spinners for a cleaner look */
.answer-form input[type="number"]::-webkit-inner-spin-button,
.answer-form input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.answer-form input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield; /* Firefox */
}


.answer-form button {
  padding: 12px;
  font-size: 1.1em;
  background-color: #0ea5e9; /* Blue from image */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.answer-form button:hover {
  background-color: #0284c7;
}

.results-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.results-area h2 {
  margin-bottom: 8px;
  color: #333;
}

.results-area p {
  font-size: 1.1em;
  color: #555;
  margin: 4px 0;
}

.medal {
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
}
.medal-gold { color: #b08d00; /* background-color: #fff3cd; */ }
.medal-silver { color: #6c757d; /* background-color: #e9ecef; */ }
.medal-bronze { color: #8c531b; /* background-color: #ffe8d6; */ }
.medal-none { color: #333; }

.results-actions {
  margin-top: 20px;
  display: flex;
  gap: 16px;
}

.results-actions button {
  padding: 10px 20px;
  font-size: 1em;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}
.results-actions button:first-child { /* Try Again */
  background-color: #0ea5e9;
  color: white;
}
.results-actions button:first-child:hover {
  background-color: #0284c7;
}
.results-actions button:last-child { /* Go Home */
  background-color: transparent;
  color: #0ea5e9;
}
.results-actions button:last-child:hover {
  background-color: #e0f2fe;
}
```

## Settings Page

File: `src/routes/settings/+page.svelte`

```css
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px - 40px);
  padding: 20px;
}

.settings-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px 32px;
  width: 100%;
  max-width: 400px;
}

h2 {
  color: #333;
  margin-bottom: 24px;
  text-align: center;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: bold;
  color: #333;
}

input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1.1em;
}

.help-text {
  font-size: 0.9em;
  color: #666;
}

.save-button {
  padding: 12px 24px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #0284c7;
}

.error {
  border-color: #dc2626;
  background-color: #fef2f2;
}

.error-message {
  color: #dc2626;
  font-size: 0.9em;
  margin-top: 4px;
}

.save-button:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}
```

## Statistics Page

File: `src/routes/statistics/+page.svelte`

```css
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px - 40px);
  padding: 20px;
}

.stats-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px 32px;
  width: 100%;
  max-width: 600px;
}

h2, h3 {
  color: #333;
  text-align: center;
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-box {
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.stat-box h3 {
  font-size: 1em;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #0ea5e9;
}

.medals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  font-size: 1.2em;
}

.recent-activities {
  border-top: 1px solid #eee;
  padding-top: 24px;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.date { color: #666; }
.time { color: #0ea5e9; font-weight: bold; }
.medal { font-size: 1.2em; }
.chart-container {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #eee;
  height: 400px;
  margin-bottom: 16px;  /* Add bottom margin to container */
}

.chart-container h3 {
  margin-bottom: 16px;
}

canvas {
  width: 100% !important;
  height: calc(100% - 20px) !important;  /* Subtract some height to ensure labels fit */
  margin-bottom: 20px;  /* Add bottom margin to canvas */
}
```

## Components

### ActionCard

File: `src/lib/components/ActionCard.svelte`

```css
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
}

.math-icon { color: #0ea5e9; }
.stats-icon { color: #10b981; }
.settings-icon { color: #6366f1; }
.profile-icon { color: #8b5cf6; }


.action-card h2 {
  font-size: 1.5rem;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.action-card .subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 12px;
}

.action-card .description {
  font-size: 0.95rem;
  color: #475569;
  margin-bottom: 20px;
  flex-grow: 1;
  line-height: 1.5;
}

.action-card button {
  display: inline-block;
  width: 100%;
  background-color: #0ea5e9;
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
  margin-top: auto;
}
.action-card button:hover:not(.disabled) {
  background-color: #0284c7;
}

.action-card button.disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
  opacity: 0.7;
}
```

### HeroSection

File: `src/lib/components/HeroSection.svelte`

```css
.hero-section {
  text-align: center;
  margin-bottom: 16px;
}

.hero-section h1 {
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 8px;
}

.hero-section p {
  font-size: 1.125rem;
  color: #475569;
}
```

### NotificationCard

File: `src/lib/components/NotificationCard.svelte`

```css
.notification-card {
  background-color: #fffbeb;
  border: 1px solid #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.notification-card .icon-area {
  font-size: 1.5rem;
  padding-top: 2px;
}

.alert-icon {
  color: #f59e0b;
}

.refresh-icon {
  font-size: 0.9em;
  margin-left: 4px;
  color: #6b7280;
  display: inline-block;
}
.notification-card .text-area h3 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  color: #78350f;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-card .text-area p {
  margin: 0;
  font-size: 0.95rem;
  color: #92400e;
}

/* Success variant styles */
.notification-card.success {
  background-color: #ecfdf5;
  border: 1px solid #d1fae5;
  border-left: 4px solid #10b981;
}

.notification-card.success .icon-area {
  color: #10b981;
}

.notification-card.success .text-area h3 {
  color: #065f46;
}

.notification-card.success .text-area p {
  color: #047857;
}

/* Refresh button styles */
.refresh-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.refresh-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
```