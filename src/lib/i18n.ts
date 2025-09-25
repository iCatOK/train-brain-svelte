import { init, locale as $locale, getLocaleFromNavigator } from 'svelte-i18n';

export const DEFAULT_LOCALE = 'en';

export function initI18n(initialLocale?: string) {
  let locale = initialLocale;
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('locale');
    locale = stored || locale || getLocaleFromNavigator() || DEFAULT_LOCALE;
  } else {
    locale = locale || DEFAULT_LOCALE;
  }

  init({
    fallbackLocale: DEFAULT_LOCALE,
    initialLocale: locale
  });

  // remember user choice on client
  if (typeof localStorage !== 'undefined') {
    $locale.subscribe((l) => {
      if (!l) return;
      try { localStorage.setItem('locale', l); } catch (e) {}
    });
  }
}
