# Help with i18n

## Init i18n

To init i18n do this:

**layout.server.js**:

Add new localizations in imports

```ts
import en from '$lib/i18n/locales/en/home.json' assert { type: 'json' };
import ru from '$lib/i18n/locales/ru/home.json' assert { type: 'json' };
```

**Page/component imports**:

```ts
import { _, waitLocale } from 'svelte-i18n';
```

**onMount section** (use async onMount):

```ts
onMount(async () => {
    // Safety check for client-side locale readiness
    await waitLocale();
    
    // rest of the code
  });
```

**Simple use**:

Html:
```ts
  <HeroSection
    title={$_('heading.title')}
    subtitle={$_('heading.subtitle')}
  />
```

TS:
```ts
$_('heading.title')
```

## Plural numbers 

To do plural localization use this example (part of the locale json file):

```
"completeButtonDisabled": "{count, plural, one {Завершите 1 упражнение} few {Завершите # упражнения} many {Завершите # упражнений} other {Завершите # упражнений}}"
```

In this project we use `count` variable name to provide numbers.
Example in code:

```ts
<ActionCard
  {...card}
  buttonText={$weeklyTestAvailable ? card.buttonText : $_('weeklyTests.completeButtonDisabled', { values: { count: remainingDrills } })}
  disabled={!$weeklyTestAvailable}
  icon={card.icon}
  iconClass={card.iconClass}
  title={card.title}
  subtitle={card.subtitle}
  description={card.description}
  targetRoute={card.targetRoute}
/>
```